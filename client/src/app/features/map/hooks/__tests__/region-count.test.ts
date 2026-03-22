/** @jest-environment jsdom */

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, beforeEach, expect, jest } from "@jest/globals";
import { useRegionCount } from "../region-count";
import { fetchRegionCount } from "@features/map/apis";
import type { RegionCount } from "../../../../../domain/types.ts";

jest.mock("@features/map/apis", () => ({
  fetchRegionCount: jest.fn(),
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

const MOCK_REGION_COUNTS: RegionCount[] = [
  { region: "Africa", count: 92 },
  { region: "Asia", count: 263 },
  { region: "Europe", count: 542 },
  { region: "North America", count: 87 },
  { region: "South America", count: 103 },
  { region: "Oceania", count: 35 },
];

type FetchArgs = { signal?: AbortSignal };
const fetchRegionCountMock = fetchRegionCount as unknown as jest.MockedFunction<
  (args: FetchArgs) => Promise<RegionCount[]>
>;

describe("useRegionCount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("初期マウント直後: isLoading=true, data=[], error=null", () => {
    const req = deferred<RegionCount[]>();
    fetchRegionCountMock.mockImplementation(() => req.promise);

    const { result } = renderHook(() => useRegionCount());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test("成功パス: fetch -> state 反映", async () => {
    const req = deferred<RegionCount[]>();
    fetchRegionCountMock.mockImplementation(() => req.promise);

    const { result } = renderHook(() => useRegionCount());

    await act(async () => {
      req.resolve(MOCK_REGION_COUNTS);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(MOCK_REGION_COUNTS);
      expect(result.current.error).toBeNull();
    });

    expect(fetchRegionCountMock).toHaveBeenCalledTimes(1);
    const call = fetchRegionCountMock.mock.calls[0]?.[0];
    expect(call.signal).toBeDefined();
  });

  test("失敗パス: error が state に反映される", async () => {
    const req = deferred<RegionCount[]>();
    fetchRegionCountMock.mockImplementation(() => req.promise);

    const { result } = renderHook(() => useRegionCount());

    await act(async () => {
      req.reject(new Error("Network Error"));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toEqual(new Error("Network Error"));
    });
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const req = deferred<RegionCount[]>();
    const captured: AbortSignal[] = [];

    fetchRegionCountMock.mockImplementation((args: FetchArgs) => {
      if (args.signal) captured.push(args.signal);
      return req.promise;
    });

    const { unmount } = renderHook(() => useRegionCount());
    unmount();

    expect(captured[0]).toBeDefined();
    expect(captured[0]?.aborted).toBe(true);
  });

  test("AbortError は error state に反映しない", async () => {
    const req = deferred<RegionCount[]>();
    fetchRegionCountMock.mockImplementation(() => req.promise);

    const { result, unmount } = renderHook(() => useRegionCount());

    await act(async () => {
      unmount();
      const abortError = new DOMException("Aborted", "AbortError");
      req.reject(abortError);
      await Promise.resolve();
    });

    expect(result.current.error).toBeNull();
  });
});
