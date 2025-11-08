/** @jest-environment jsdom */

import { renderHook, act, waitFor } from "@testing-library/react";
import { jest, expect, test, beforeEach, describe } from "@jest/globals";
import { useTopPage } from "./use-top-page";
import { fetchTopFirstPage } from "../apis";
import { toWorldHeritageListVm } from "../mappers/to-world-heritage-vm";

type MinimalAbortSignal = { aborted: boolean };

interface MinimalAbortController {
  readonly signal: MinimalAbortSignal;
  abort(): void;
}
type AbortControllerCtor = new () => MinimalAbortController;

if (!("AbortController" in globalThis) || typeof globalThis.AbortController !== "function") {
  class FakeAbortController implements MinimalAbortController {
    private _signal: MinimalAbortSignal = { aborted: false };
    get signal(): MinimalAbortSignal {
      return this._signal;
    }
    abort(): void {
      this._signal.aborted = true;
    }
  }
  (globalThis as { AbortController: AbortControllerCtor }).AbortController = FakeAbortController;
}

jest.mock("../apis", () => ({
  fetchTopFirstPage: jest.fn(),
}));
jest.mock("../mappers/to-world-heritage-vm", () => ({
  toWorldHeritageListVm: jest.fn(),
}));

type FetchFn = (opts?: { signal?: AbortSignal }) => Promise<unknown[]>;
const fetchTopFirstPageMock = fetchTopFirstPage as unknown as jest.MockedFunction<FetchFn>;

type MapFn = (dtoList: unknown[]) => unknown[];
const toWorldHeritageListVmMock = toWorldHeritageListVm as unknown as jest.MockedFunction<MapFn>;

// ---- deferred ヘルパ
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

describe("useTopPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("初期マウント直後: isLoading=true, items=[], isError=false", () => {
    const d = deferred<unknown[]>();
    fetchTopFirstPageMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useTopPage());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  test("成功パス: fetch -> map -> state 反映", async () => {
    const raw = [{ id: 1 }];
    const vm = [{ id: 1, name: "Site" }];
    const d = deferred<unknown[]>();

    fetchTopFirstPageMock.mockImplementation(() => d.promise);
    toWorldHeritageListVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useTopPage());

    await act(async () => {
      d.resolve(raw);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.items).toEqual(vm);
      expect(result.current.isError).toBe(false);
    });

    expect(fetchTopFirstPageMock).toHaveBeenCalledTimes(1);
    expect(toWorldHeritageListVmMock).toHaveBeenCalledWith(raw);
  });

  test("通常エラー: isError=true, items=[], isLoading=false, error が保持される", async () => {
    const d = deferred<unknown[]>();
    fetchTopFirstPageMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useTopPage());

    const boom = new Error("boom");
    await act(async () => {
      d.reject(boom);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.items).toEqual([]);
      expect(result.current.error).toBe(boom);
    });
  });

  test("AbortError は無視される（エラー状態にしない）", async () => {
    const first = deferred<unknown[]>();
    const second = deferred<unknown[]>();

    const calls: Array<{ signal?: AbortSignal }> = [];
    fetchTopFirstPageMock.mockImplementation((opts) => {
      calls.push({ signal: opts?.signal });
      return calls.length === 1 ? first.promise : second.promise;
    });

    const vm = [{ id: 2, name: "Ok" }];
    toWorldHeritageListVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useTopPage());

    await act(async () => {
      result.current.reload();
    });
    await act(async () => {
      first.reject({ name: "AbortError" });
      await Promise.resolve();
    });
    await act(async () => {
      second.resolve([{ id: 2 }]);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.items).toEqual(vm);
    });

    expect(calls.length).toBe(2);
    expect(calls[0].signal?.aborted).toBe(true);
  });

  test("reload は in-flight リクエストを中断して再度発火する", async () => {
    const first = deferred<unknown[]>();
    const second = deferred<unknown[]>();

    const signals: (AbortSignal | undefined)[] = [];
    fetchTopFirstPageMock.mockImplementation((opts) => {
      signals.push(opts?.signal);
      return signals.length === 1 ? first.promise : second.promise;
    });

    const vm = [{ id: 3, name: "R" }];
    toWorldHeritageListVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useTopPage());

    await act(async () => {
      result.current.reload();
    });
    await act(async () => {
      second.resolve([{ id: 3 }]);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(signals[0]?.aborted).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.items).toEqual(vm);
    });
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<unknown[]>();
    const captured: (AbortSignal | undefined)[] = [];
    fetchTopFirstPageMock.mockImplementation((opts) => {
      captured.push(opts?.signal);
      return d.promise;
    });

    const { unmount } = renderHook(() => useTopPage());
    unmount();

    expect(captured[0]).toBeDefined();
    expect(captured[0]?.aborted).toBe(true);
  });
});
