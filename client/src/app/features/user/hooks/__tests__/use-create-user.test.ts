/** @jest-environment jsdom */

import { jest } from "@jest/globals";

jest.mock("../../apis", () => ({
  createUser: jest.fn(),
}));

jest.mock("../../mapper/to-create-user-request", () => ({
  toCreateUserRequest: jest.fn(),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useCreateUser } from "../use-create-user";
import { createUser } from "../../apis";
import { toCreateUserRequest } from "../../mapper/to-create-user-request";
import type { ApiUserDto, CreateUserRequest } from "../../apis/user-api";
import type { CreateUserFormValues } from "../../types";

type CreateFn = (
  request: CreateUserRequest,
  opts?: { signal?: AbortSignal },
) => Promise<ApiUserDto>;
const createUserMock = createUser as unknown as jest.MockedFunction<CreateFn>;

type MapFn = (values: CreateUserFormValues) => CreateUserRequest;
const toCreateUserRequestMock = toCreateUserRequest as unknown as jest.MockedFunction<MapFn>;

const formValues: CreateUserFormValues = {
  firstName: "Taro",
  lastName: "Yamada",
  email: "taro@example.com",
  password: "password123",
  ageRange: "teens",
};

const request: CreateUserRequest = {
  first_name: "Taro",
  last_name: "Yamada",
  email: "taro@example.com",
  password: "password123",
  age_range: "teens",
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

describe("useCreateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toCreateUserRequestMock.mockReturnValue(request);
  });

  test("初期状態: data=null, isLoading=false, error=null", () => {
    const { result } = renderHook(() => useCreateUser());

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("成功パス: submit -> loading true -> data 反映 -> loading false", async () => {
    const d = deferred<ApiUserDto>();
    createUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useCreateUser());

    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(formValues);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      d.resolve(user);
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(user);
    expect(result.current.error).toBeNull();
    expect(toCreateUserRequestMock).toHaveBeenCalledWith(formValues);
    expect(createUserMock).toHaveBeenCalledWith(
      request,
      expect.objectContaining({ signal: expect.any(Object) }),
    );
  });

  test("通常エラー: error に反映され、data は null のまま", async () => {
    const d = deferred<ApiUserDto>();
    createUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useCreateUser());

    const boom = new Error("boom");
    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(formValues);
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
    createUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useCreateUser());

    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(formValues);
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

    createUserMock.mockImplementation((_req, opts) => {
      signals.push(opts?.signal);
      return signals.length === 1 ? first.promise : second.promise;
    });

    const { result } = renderHook(() => useCreateUser());

    act(() => {
      void result.current.submit(formValues);
    });

    await waitFor(() => expect(signals).toHaveLength(1));

    let secondSubmit!: Promise<void>;
    act(() => {
      secondSubmit = result.current.submit(formValues);
    });

    await act(async () => {
      second.resolve(user);
      await secondSubmit;
    });

    expect(signals[0]?.aborted).toBe(true);
    expect(result.current.data).toEqual(user);
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<ApiUserDto>();
    const signals: Array<AbortSignal | undefined> = [];

    createUserMock.mockImplementation((_req, opts) => {
      signals.push(opts?.signal);
      return d.promise;
    });

    const { result, unmount } = renderHook(() => useCreateUser());

    act(() => {
      void result.current.submit(formValues);
    });

    unmount();

    expect(signals[0]?.aborted).toBe(true);
  });
});
