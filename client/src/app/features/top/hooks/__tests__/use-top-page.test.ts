/** @jest-environment jsdom */

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, beforeEach, expect, jest } from "@jest/globals";
import { useTopPage } from "../use-top-page";
import { fetchTopPage } from "@features/top/apis";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm";
import type { ListResult } from "../../../../../domain/types.ts";

jest.mock("@features/top/apis", () => ({
  fetchTopPage: jest.fn(),
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

type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

const mkResult = <T>(items: T[], pagination?: Partial<Pagination>): ListResult<T> => ({
  items,
  pagination: {
    current_page: 1,
    per_page: 50,
    total: items.length,
    last_page: 1,
    ...(pagination ?? {}),
  },
});

type FetchArgs = { currentPage: number; perPage: number; signal?: AbortSignal };

// ✅ fetchTopPage は args を受けて ListResult を返す
const fetchTopPageMock = fetchTopPage as unknown as jest.MockedFunction<
  (args: FetchArgs) => Promise<ListResult<unknown>>
>;

const toWorldHeritageListVmMock = toWorldHeritageListVm as unknown as jest.MockedFunction<
  (dtoList: unknown[]) => unknown[]
>;

describe("useTopPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("初期マウント直後: isLoading=true, items=[], isError=false", () => {
    const req = deferred<ListResult<unknown>>();
    fetchTopPageMock.mockImplementation(() => req.promise);

    const { result } = renderHook(() => useTopPage());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  test("成功パス: fetch -> map -> state 反映", async () => {
    const rawItems = [{ id: 1 }];
    const vm = [{ id: 1, name: "Site" }];
    const req = deferred<ListResult<unknown>>();

    fetchTopPageMock.mockImplementation(() => req.promise);
    toWorldHeritageListVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useTopPage());

    await act(async () => {
      req.resolve(mkResult(rawItems));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.items).toEqual(vm);
      expect(result.current.isError).toBe(false);
    });

    expect(fetchTopPageMock).toHaveBeenCalledTimes(1);

    // currentPage=1, perPage=50 は hook の初期値
    const call = fetchTopPageMock.mock.calls[0]?.[0];
    expect(call.currentPage).toBe(1);
    expect(call.perPage).toBe(50);
    expect(call.signal).toBeDefined();

    expect(toWorldHeritageListVmMock).toHaveBeenCalledTimes(1);
    expect(toWorldHeritageListVmMock).toHaveBeenCalledWith(rawItems);
  });

  test("reload は in-flight リクエストを abort して再度発火する（1本目は pending のまま）", async () => {
    const first = deferred<ListResult<unknown>>(); // resolve しない（pending）
    const second = deferred<ListResult<unknown>>();

    const calls: AbortSignal[] = [];
    fetchTopPageMock.mockImplementation((args: FetchArgs) => {
      if (args.signal) calls.push(args.signal);
      return calls.length === 1 ? first.promise : second.promise;
    });

    const vm = [{ id: 2, name: "Ok" }];
    toWorldHeritageListVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useTopPage());

    // 1本目が発火してる状態で reload
    await act(async () => {
      result.current.reload();
      await Promise.resolve();
    });

    // 2本目を成功させる
    await act(async () => {
      second.resolve(mkResult([{ id: 2 }]));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.items).toEqual(vm);
    });

    expect(fetchTopPageMock).toHaveBeenCalledTimes(2);
    // 1回目の signal が abort 済み
    expect(calls[0]?.aborted).toBe(true);
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const req = deferred<ListResult<unknown>>();
    const captured: AbortSignal[] = [];

    fetchTopPageMock.mockImplementation((args: FetchArgs) => {
      if (args.signal) captured.push(args.signal);
      return req.promise; // pending
    });

    const { unmount } = renderHook(() => useTopPage());
    unmount();

    expect(captured[0]).toBeDefined();
    expect(captured[0]?.aborted).toBe(true);
  });
});
