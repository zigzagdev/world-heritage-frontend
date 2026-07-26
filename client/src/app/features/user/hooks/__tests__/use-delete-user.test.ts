/** @jest-environment jsdom */

import { jest } from "@jest/globals";

jest.mock("../../apis", () => ({
  deleteUser: jest.fn(),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useDeleteUser } from "../use-delete-user";
import { deleteUser } from "../../apis";

type DeleteFn = (id: number, opts?: { signal?: AbortSignal }) => Promise<void>;
const deleteUserMock = deleteUser as unknown as jest.MockedFunction<DeleteFn>;

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

describe("useDeleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("初期状態: done=false, isLoading=false, error=null", () => {
    const { result } = renderHook(() => useDeleteUser());

    expect(result.current.done).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("成功パス: submit -> loading true -> done true -> loading false", async () => {
    const d = deferred<void>();
    deleteUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useDeleteUser());

    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(1);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      d.resolve(undefined);
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.done).toBe(true);
    expect(result.current.error).toBeNull();
    expect(deleteUserMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ signal: expect.any(Object) }),
    );
  });

  test("通常エラー: error に反映され、done は false のまま", async () => {
    const d = deferred<void>();
    deleteUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useDeleteUser());

    const boom = new Error("boom");
    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(1);
    });

    await act(async () => {
      d.reject(boom);
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.done).toBe(false);
    expect(result.current.error).toBe(boom);
  });

  test("AbortError は無視される（エラー状態にしない）", async () => {
    const d = deferred<void>();
    deleteUserMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useDeleteUser());

    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.submit(1);
    });

    await act(async () => {
      d.reject(new DOMException("Aborted", "AbortError"));
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.done).toBe(false);
  });

  test("再送信時に前のリクエストを abort する", async () => {
    const first = deferred<void>();
    const second = deferred<void>();
    const signals: Array<AbortSignal | undefined> = [];

    deleteUserMock.mockImplementation((_id, opts) => {
      signals.push(opts?.signal);
      return signals.length === 1 ? first.promise : second.promise;
    });

    const { result } = renderHook(() => useDeleteUser());

    act(() => {
      void result.current.submit(1);
    });

    await waitFor(() => expect(signals).toHaveLength(1));

    let secondSubmit!: Promise<void>;
    act(() => {
      secondSubmit = result.current.submit(1);
    });

    await act(async () => {
      second.resolve(undefined);
      await secondSubmit;
    });

    expect(signals[0]?.aborted).toBe(true);
    expect(result.current.done).toBe(true);
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<void>();
    const signals: Array<AbortSignal | undefined> = [];

    deleteUserMock.mockImplementation((_id, opts) => {
      signals.push(opts?.signal);
      return d.promise;
    });

    const { result, unmount } = renderHook(() => useDeleteUser());

    act(() => {
      void result.current.submit(1);
    });

    unmount();

    expect(signals[0]?.aborted).toBe(true);
  });
});
