/** @jest-environment jsdom */

import { jest } from "@jest/globals";

jest.mock("../../apis", () => ({
  getUser: jest.fn(),
}));

jest.mock("../../mapper/to-user-profile", () => ({
  toUserProfile: jest.fn(),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useGetUser } from "../use-get-user";
import { getUser } from "../../apis";
import { toUserProfile } from "../../mapper/to-user-profile";
import type { ApiUserDto } from "../../apis/user-api";
import type { UserProfile } from "../../types";

type GetFn = (id: number, opts?: { signal?: AbortSignal }) => Promise<ApiUserDto>;
const getUserMock = getUser as unknown as jest.MockedFunction<GetFn>;

type MapFn = (dto: ApiUserDto) => UserProfile;
const toUserProfileMock = toUserProfile as unknown as jest.MockedFunction<MapFn>;

const dto: ApiUserDto = {
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

describe("useGetUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toUserProfileMock.mockReturnValue(profile);
  });

  test("初期状態: data=null, isLoading=true, error=null", () => {
    getUserMock.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useGetUser(1));

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test("成功パス: mount時に getUser -> toUserProfile の順で呼ばれ、data に反映される", async () => {
    const d = deferred<ApiUserDto>();
    getUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useGetUser(1));

    await act(async () => {
      d.resolve(dto);
      await d.promise;
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(profile);
    expect(result.current.error).toBeNull();
    expect(getUserMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ signal: expect.any(Object) }),
    );
    expect(toUserProfileMock).toHaveBeenCalledWith(dto);
  });

  test("エラー: error に反映され、data は null のまま", async () => {
    const boom = new Error("boom");
    const d = deferred<ApiUserDto>();
    getUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useGetUser(1));

    await act(async () => {
      d.reject(boom);
      await d.promise.catch(() => {});
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(boom);
  });

  test("AbortError は無視される（エラー状態にしない）", async () => {
    const d = deferred<ApiUserDto>();
    getUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useGetUser(1));

    await act(async () => {
      d.reject(new DOMException("Aborted", "AbortError"));
      await d.promise.catch(() => {});
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  test("idが変わると前のリクエストを abort して再取得する", async () => {
    const first = deferred<ApiUserDto>();
    const second = deferred<ApiUserDto>();
    const signals: Array<AbortSignal | undefined> = [];

    getUserMock.mockImplementation((_id, opts) => {
      signals.push(opts?.signal);
      return signals.length === 1 ? first.promise : second.promise;
    });

    const { result, rerender } = renderHook(({ id }) => useGetUser(id), {
      initialProps: { id: 1 },
    });

    await waitFor(() => expect(signals).toHaveLength(1));

    rerender({ id: 2 });

    await waitFor(() => expect(signals).toHaveLength(2));
    expect(signals[0]?.aborted).toBe(true);

    await act(async () => {
      second.resolve(dto);
      await second.promise;
    });

    await waitFor(() => expect(result.current.data).toEqual(profile));
    expect(getUserMock).toHaveBeenLastCalledWith(
      2,
      expect.objectContaining({ signal: expect.any(Object) }),
    );
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<ApiUserDto>();
    const signals: Array<AbortSignal | undefined> = [];

    getUserMock.mockImplementation((_id, opts) => {
      signals.push(opts?.signal);
      return d.promise;
    });

    const { unmount } = renderHook(() => useGetUser(1));

    unmount();

    expect(signals[0]?.aborted).toBe(true);
  });
});
