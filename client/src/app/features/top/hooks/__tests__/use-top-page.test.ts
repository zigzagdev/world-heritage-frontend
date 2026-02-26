/** @jest-environment jsdom */

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, beforeEach, expect, jest } from "@jest/globals";
import { useTopPage } from "../use-top-page";
import { fetchTopFirstPage } from "../../apis";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm";

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
  (globalThis as unknown as { AbortController: AbortControllerCtor }).AbortController =
    FakeAbortController;
}

jest.mock("../../apis", () => ({
  fetchTopFirstPage: jest.fn(),
}));

jest.mock("@features/heritages/mappers/to-world-heritage-vm", () => ({
  __esModule: true,
  toWorldHeritageListVm: jest.fn(),
}));

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

// ---- New API shape ----
type PaginationDto = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

type ListResult<T> = {
  items: T[];
  pagination: PaginationDto;
};

// fetchTopFirstPage({ page, perPage, signal })
type FetchParams = {
  page: number;
  perPage: number;
  signal?: AbortSignal;
};

type FetchFn = (params: FetchParams) => Promise<ListResult<unknown>>;
const fetchTopFirstPageMock = fetchTopFirstPage as unknown as jest.MockedFunction<FetchFn>;

type MapFn = (dtoList: unknown[]) => unknown[];
const toWorldHeritageListVmMock = toWorldHeritageListVm as unknown as jest.MockedFunction<MapFn>;

const defaultPagination = (overrides?: Partial<PaginationDto>): PaginationDto => ({
  current_page: 1,
  per_page: 50,
  total: 0,
  last_page: 1,
  ...overrides,
});

describe("useTopPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("初期マウント直後: isLoading=true, items=[], isError=false", () => {
    const req = deferred<ListResult<unknown>>();
    fetchTopFirstPageMock.mockImplementation(() => req.promise);

    const { result } = renderHook(() => useTopPage());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  test("成功パス: fetch -> map -> state 反映", async () => {
    const rawItems = [{ id: 1 }];
    const vm = [{ id: 1, name: "Site" }];
    const req = deferred<ListResult<unknown>>();

    fetchTopFirstPageMock.mockImplementation(() => req.promise);
    toWorldHeritageListVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useTopPage());

    await act(async () => {
      req.resolve({ items: rawItems, pagination: defaultPagination({ total: 1, last_page: 1 }) });
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.items).toEqual(vm);
      expect(result.current.isError).toBe(false);
    });

    expect(fetchTopFirstPageMock).toHaveBeenCalledTimes(1);
    // New signature: params object
    expect(fetchTopFirstPageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        perPage: 50,
      }),
    );

    expect(toWorldHeritageListVmMock).toHaveBeenCalledTimes(1);
    expect(toWorldHeritageListVmMock).toHaveBeenCalledWith(rawItems);
  });

  test("通常エラー: isError=true, items=[], isLoading=false, error が保持される", async () => {
    const req = deferred<ListResult<unknown>>();
    fetchTopFirstPageMock.mockImplementation(() => req.promise);

    const { result } = renderHook(() => useTopPage());

    const boom = new Error("boom");
    await act(async () => {
      req.reject(boom);
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
    const first = deferred<ListResult<unknown>>();
    const second = deferred<ListResult<unknown>>();

    const calls: Array<{ signal?: AbortSignal }> = [];
    fetchTopFirstPageMock.mockImplementation((params: FetchParams) => {
      calls.push({ signal: params.signal });
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
      second.resolve({
        items: [{ id: 2 }],
        pagination: defaultPagination({ total: 1, last_page: 1 }),
      });
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
    const first = deferred<ListResult<unknown>>();
    const second = deferred<ListResult<unknown>>();
    const calls: Array<{ signal?: AbortSignal }> = [];

    fetchTopFirstPageMock.mockImplementation((params: FetchParams) => {
      calls.push({ signal: params.signal });
      return calls.length === 1 ? first.promise : second.promise;
    });

    const vm = [{ id: 3, name: "R" }];
    toWorldHeritageListVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useTopPage());

    await act(async () => {
      result.current.reload();
    });

    await act(async () => {
      second.resolve({
        items: [{ id: 3 }],
        pagination: defaultPagination({ total: 1, last_page: 1 }),
      });
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.items).toEqual(vm);
    });

    expect(calls.length).toBe(2);
    expect(calls[0].signal?.aborted).toBe(true);
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const req = deferred<ListResult<unknown>>();
    const captured: Array<AbortSignal | undefined> = [];

    fetchTopFirstPageMock.mockImplementation((params: FetchParams) => {
      captured.push(params.signal);
      return req.promise;
    });

    const { unmount } = renderHook(() => useTopPage());
    unmount();

    expect(captured[0]).toBeDefined();
    expect(captured[0]?.aborted).toBe(true);
  });
});
