/** @jest-environment jsdom */

import { jest } from "@jest/globals";

jest.mock("../../apis", () => ({
  removeFavorite: jest.fn(),
}));

jest.mock("@shared/auth/token-storage.ts", () => ({
  getStoredToken: jest.fn(),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useRemoveFavorite } from "../use-remove-favorite";
import { removeFavorite } from "../../apis";
import { getStoredToken } from "@shared/auth/token-storage.ts";

type RemoveFn = (
  worldHeritageId: number,
  token: string,
  opts?: { signal?: AbortSignal },
) => Promise<void>;
const removeFavoriteMock = removeFavorite as unknown as jest.MockedFunction<RemoveFn>;
const getStoredTokenMock = getStoredToken as unknown as jest.MockedFunction<() => string | null>;

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

describe("useRemoveFavorite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStoredTokenMock.mockReturnValue("1|abcdef");
  });

  test("初期状態: isRemoved=false, isLoading=false, error=null", () => {
    const { result } = renderHook(() => useRemoveFavorite());

    expect(result.current.isRemoved).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("成功パス: submit -> loading true -> isRemoved true -> loading false", async () => {
    const d = deferred<void>();
    removeFavoriteMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useRemoveFavorite());

    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(42);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      d.resolve(undefined);
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRemoved).toBe(true);
    expect(result.current.error).toBeNull();
    expect(removeFavoriteMock).toHaveBeenCalledWith(
      42,
      "1|abcdef",
      expect.objectContaining({ signal: expect.any(Object) }),
    );
  });

  test("未認証: token が無い場合はエラーになり API を呼ばない", async () => {
    getStoredTokenMock.mockReturnValue(null);

    const { result } = renderHook(() => useRemoveFavorite());

    await act(async () => {
      await result.current.submit(42);
    });

    expect(removeFavoriteMock).not.toHaveBeenCalled();
    expect(result.current.isRemoved).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  test("通常エラー: error に反映され、isRemoved は false のまま", async () => {
    const d = deferred<void>();
    removeFavoriteMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useRemoveFavorite());

    const boom = new Error("boom");
    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(42);
    });

    await act(async () => {
      d.reject(boom);
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRemoved).toBe(false);
    expect(result.current.error).toBe(boom);
  });

  test("AbortError は無視される（エラー状態にしない）", async () => {
    const d = deferred<void>();
    removeFavoriteMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useRemoveFavorite());

    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(42);
    });

    await act(async () => {
      d.reject(new DOMException("Aborted", "AbortError"));
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isRemoved).toBe(false);
  });

  test("再送信時に前のリクエストを abort する", async () => {
    const first = deferred<void>();
    const second = deferred<void>();
    const signals: Array<AbortSignal | undefined> = [];

    removeFavoriteMock.mockImplementation((_id, _token, opts) => {
      signals.push(opts?.signal);
      return signals.length === 1 ? first.promise : second.promise;
    });

    const { result } = renderHook(() => useRemoveFavorite());

    act(() => {
      void result.current.submit(42);
    });

    await waitFor(() => expect(signals).toHaveLength(1));

    let secondSubmit!: Promise<void>;
    act(() => {
      secondSubmit = result.current.submit(42);
    });

    await act(async () => {
      second.resolve(undefined);
      await secondSubmit;
    });

    expect(signals[0]?.aborted).toBe(true);
    expect(result.current.isRemoved).toBe(true);
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<void>();
    const signals: Array<AbortSignal | undefined> = [];

    removeFavoriteMock.mockImplementation((_id, _token, opts) => {
      signals.push(opts?.signal);
      return d.promise;
    });

    const { result, unmount } = renderHook(() => useRemoveFavorite());

    act(() => {
      void result.current.submit(42);
    });

    unmount();

    expect(signals[0]?.aborted).toBe(true);
  });
});
