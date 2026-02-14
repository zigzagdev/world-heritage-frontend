/** @jest-environment jsdom */

import { renderHook, act, waitFor } from "@testing-library/react";
import { jest, expect, test, beforeEach, describe } from "@jest/globals";
import { useHeritageSearchQuery } from "../use-search-heritage-query.ts";
import { fetchSearchHeritagesResult } from "../../apis";
import type { SearchResponse } from "../../apis/search-api";

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

// hooksは「API 関数を呼び、状態を更新する」なので、ここはAPIをMockする形で対応
jest.mock("../../apis", () => ({
  fetchSearchHeritagesResult: jest.fn(),
}));

type FetchFn = (
  params: { keyword?: string; region?: string; category?: string; page?: number; perPage?: number },
  init?: { signal?: AbortSignal },
) => Promise<SearchResponse>;

const fetchSearchHeritagesResultMock =
  fetchSearchHeritagesResult as unknown as jest.MockedFunction<FetchFn>;

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

type Params = {
  keyword?: string;
  region?: string;
  category?: string;
  page?: number;
  perPage?: number;
};

const OK: SearchResponse = {
  status: "success",
  data: {
    data: [
      {
        id: 1,
        official_name: "Himeji-jo",
        name: "Himeji-jo",
        name_jp: "姫路城",
        country: "Japan",
        region: "Asia",
        state_party: "JPN",
        category: "Cultural",
        criteria: ["i", "iv"],
        year_inscribed: 1993,
        area_hectares: null,
        buffer_zone_hectares: null,
        is_endangered: false,
        latitude: null,
        longitude: null,
        short_description: "Test description",
        unesco_site_url: "https://whc.unesco.org/en/list/661",
        state_party_codes: ["JPN"],
        state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
        primary_state_party_code: "JPN",
        image_url: null,
        images: [],
      },
    ],
    pagination: { current_page: 1, per_page: 30, total: 1, last_page: 1 },
  },
};

describe("useHeritageSearchQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("初期マウント直後: isLoading=true, data=null, error=null", () => {
    const d = deferred<SearchResponse>();
    fetchSearchHeritagesResultMock.mockImplementation(() => d.promise);

    const params: Params = { keyword: "Japan", page: 1, perPage: 30 };
    const { result } = renderHook(() => useHeritageSearchQuery(params));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  test("成功パス: fetch -> state 反映", async () => {
    const d = deferred<SearchResponse>();
    fetchSearchHeritagesResultMock.mockImplementation(() => d.promise);

    const params: Params = {
      keyword: "Japan",
      region: "APA",
      category: "Cultural",
      page: 1,
      perPage: 30,
    };
    const { result } = renderHook(() => useHeritageSearchQuery(params));

    await act(async () => {
      d.resolve(OK);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(OK);
      expect(result.current.error).toBe(null);
    });

    expect(fetchSearchHeritagesResultMock).toHaveBeenCalledTimes(1);

    const [calledParams, calledInit] = fetchSearchHeritagesResultMock.mock.calls[0];
    expect(calledParams).toEqual({
      keyword: "Japan",
      region: "APA",
      category: "Cultural",
      page: 1,
      perPage: 30,
    });
    expect(calledInit?.signal).toBeDefined();
  });

  test("通常エラー: error が保持される / isLoading=false", async () => {
    const d = deferred<SearchResponse>();
    fetchSearchHeritagesResultMock.mockImplementation(() => d.promise);

    const params: Params = { keyword: "Japan", page: 1, perPage: 30 };
    const { result } = renderHook(() => useHeritageSearchQuery(params));

    const boom = new Error("boom");

    await act(async () => {
      d.reject(boom);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(boom);
    });
  });

  test("AbortError は無視される（error にしない）", async () => {
    const first = deferred<SearchResponse>();
    const second = deferred<SearchResponse>();

    const calls: Array<{ signal?: AbortSignal }> = [];

    fetchSearchHeritagesResultMock.mockImplementation((_params, init) => {
      calls.push({ signal: init?.signal });
      return calls.length === 1 ? first.promise : second.promise;
    });

    const initialParams: Params = { keyword: "Japan", page: 1, perPage: 30 };
    const { result, rerender } = renderHook((p: Params) => useHeritageSearchQuery(p), {
      initialProps: initialParams,
    });

    rerender({ keyword: "Japan", page: 2, perPage: 30 });

    await act(async () => {
      first.reject(new DOMException("Aborted", "AbortError"));
      await Promise.resolve();
    });

    await act(async () => {
      second.resolve(OK);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toEqual(OK);
    });

    expect(calls.length).toBe(2);
    expect(calls[0].signal?.aborted).toBe(true);
  });

  test("params 変更で in-flight を abort して再度発火する", async () => {
    const first = deferred<SearchResponse>();
    const second = deferred<SearchResponse>();

    const signals: (AbortSignal | undefined)[] = [];

    fetchSearchHeritagesResultMock.mockImplementation((_params, init) => {
      signals.push(init?.signal);
      return signals.length === 1 ? first.promise : second.promise;
    });

    const { result, rerender } = renderHook((p: Params) => useHeritageSearchQuery(p), {
      initialProps: { keyword: "Japan", page: 1, perPage: 30 },
    });

    rerender({ keyword: "Japan", page: 2, perPage: 30 });

    await act(async () => {
      second.resolve(OK);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(signals[0]?.aborted).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(OK);
    });

    expect(fetchSearchHeritagesResultMock).toHaveBeenCalledTimes(2);
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<SearchResponse>();

    const captured: (AbortSignal | undefined)[] = [];
    fetchSearchHeritagesResultMock.mockImplementation((_params, init) => {
      captured.push(init?.signal);
      return d.promise;
    });

    const { unmount } = renderHook(() =>
      useHeritageSearchQuery({ keyword: "Japan", page: 1, perPage: 30 }),
    );

    unmount();

    expect(captured[0]).toBeDefined();
    expect(captured[0]?.aborted).toBe(true);
  });
});
