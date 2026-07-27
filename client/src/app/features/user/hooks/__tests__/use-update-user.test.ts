/** @jest-environment jsdom */

import { jest } from "@jest/globals";

jest.mock("../../apis", () => ({
  updateUser: jest.fn(),
}));

jest.mock("../../mapper/to-update-user-request", () => ({
  toUpdateUserRequest: jest.fn(),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useUpdateUser } from "../use-update-user";
import { updateUser } from "../../apis";
import { toUpdateUserRequest } from "../../mapper/to-update-user-request";
import type { ApiUserDto, UpdateUserRequest } from "../../apis/user-api";
import type { UpdateUserFormValues } from "../../mapper/to-update-user-request";
import type { UserProfile } from "../../types";

type UpdateFn = (
  id: number,
  request: UpdateUserRequest,
  opts?: { signal?: AbortSignal },
) => Promise<ApiUserDto>;
const updateUserMock = updateUser as unknown as jest.MockedFunction<UpdateFn>;

type MapFn = (values: UpdateUserFormValues) => UpdateUserRequest;
const toUpdateUserRequestMock = toUpdateUserRequest as unknown as jest.MockedFunction<MapFn>;

const formValues: UpdateUserFormValues = {
  firstName: "Taro",
  lastName: "Yamada",
  email: "taro@example.com",
};

const request: UpdateUserRequest = {
  first_name: "Taro",
  last_name: "Yamada",
  email: "taro@example.com",
};

const user: ApiUserDto = {
  id: 1,
  first_name: "Taro",
  last_name: "Yamada",
  email: "taro@example.com",
  age_range: "teens",
  subscription_tier: "free",
  subscription_expires_at: null,
};

const profile: UserProfile = {
  id: 1,
  firstName: "Taro",
  lastName: "Yamada",
  email: "taro@example.com",
  ageRange: "teens",
  subscriptionTier: "free",
  subscriptionExpiresAt: null,
};

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (v: T) => void;
  reject: (e: unknown) => void;
};
const deferred = <T>(): Deferred<T> => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("useUpdateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toUpdateUserRequestMock.mockReturnValue(request);
  });

  test("初期状態: data=null, isLoading=false, error=null", () => {
    const { result } = renderHook(() => useUpdateUser());

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("成功パス: submit -> loading true -> data 反映 -> loading false", async () => {
    const d = deferred<ApiUserDto>();
    updateUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useUpdateUser());

    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(1, formValues);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      d.resolve(user);
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(profile);
    expect(result.current.error).toBeNull();
    expect(toUpdateUserRequestMock).toHaveBeenCalledWith(formValues);
    expect(updateUserMock).toHaveBeenCalledWith(
      1,
      request,
      expect.objectContaining({ signal: expect.any(Object) }),
    );
  });

  test("通常エラー: error に反映され、data は null のまま", async () => {
    const d = deferred<ApiUserDto>();
    updateUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useUpdateUser());

    const boom = new Error("boom");
    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(1, formValues);
    });

    await act(async () => {
      d.reject(boom);
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(boom);
  });

  test("AbortError は無視される（エラー状態にしない）", async () => {
    const d = deferred<ApiUserDto>();
    updateUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useUpdateUser());

    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(1, formValues);
    });

    await act(async () => {
      d.reject(new DOMException("Aborted", "AbortError"));
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  test("再送信時に前のリクエストを abort する", async () => {
    const first = deferred<ApiUserDto>();
    const second = deferred<ApiUserDto>();
    const signals: Array<AbortSignal | undefined> = [];

    updateUserMock.mockImplementation((_id, _req, opts) => {
      signals.push(opts?.signal);
      return signals.length === 1 ? first.promise : second.promise;
    });

    const { result } = renderHook(() => useUpdateUser());

    act(() => {
      void result.current.submit(1, formValues);
    });

    await waitFor(() => expect(signals).toHaveLength(1));

    let secondSubmit!: Promise<void>;
    act(() => {
      secondSubmit = result.current.submit(1, formValues);
    });

    await act(async () => {
      second.resolve(user);
      await secondSubmit;
    });

    expect(signals[0]?.aborted).toBe(true);
    expect(result.current.data).toEqual(profile);
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<ApiUserDto>();
    const signals: Array<AbortSignal | undefined> = [];

    updateUserMock.mockImplementation((_id, _req, opts) => {
      signals.push(opts?.signal);
      return d.promise;
    });

    const { result, unmount } = renderHook(() => useUpdateUser());

    act(() => {
      void result.current.submit(1, formValues);
    });

    unmount();

    expect(signals[0]?.aborted).toBe(true);
  });
});
