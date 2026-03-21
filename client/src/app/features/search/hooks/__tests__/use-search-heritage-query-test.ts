/** @jest-environment jsdom */

import { renderHook, act, waitFor } from "@testing-library/react";
import { jest, expect, test, beforeEach, describe } from "@jest/globals";
import { useHeritageSearchQuery } from "../use-search-heritage-query.ts";
import { fetchSearchHeritagesResult } from "../../apis";
import type { ApiSearchResponse, SearchParams } from "../../apis/search-api";
import type { HeritageSearchParams } from "../../../../../domain/types.ts";

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

jest.mock("../../apis", () => ({
  fetchSearchHeritagesResult: jest.fn(),
}));

type FetchFn = (
  params: SearchParams,
  init?: { signal?: AbortSignal },
) => Promise<ApiSearchResponse>;

const fetchSearchHeritagesResultMock =
  fetchSearchHeritagesResult as unknown as jest.MockedFunction<FetchFn>;

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

const createDeferred = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const OK: ApiSearchResponse = {
  status: "success",
  data: {
    items: [
      {
        id: 1,
        official_name: "Himeji-jo",
        name: "Himeji-jo",
        heritage_name_jp: "姫路城",
        country: "Japan",
        country_name_jp: "日本",
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
        thumbnail: null,
      },
    ],
    pagination: { current_page: 1, per_page: 30, total: 1, last_page: 1 },
  },
};

const makeParams = (overrides: Partial<HeritageSearchParams> = {}): HeritageSearchParams => ({
  search_query: null,
  country: null,
  region: null,
  category: null,
  year_inscribed_from: null,
  year_inscribed_to: null,
  current_page: 1,
  per_page: 30,
  order: null,
  ...overrides,
});

const toExpectedSearchParams = (params: HeritageSearchParams): SearchParams => ({
  keyword: params.search_query ?? undefined,
  region: params.region ?? undefined,
  category: params.category ?? undefined,
  yearInscribedFrom: params.year_inscribed_from ?? undefined,
  yearInscribedTo: params.year_inscribed_to ?? undefined,
  currentPage: params.current_page,
  perPage: params.per_page,
});

describe("useHeritageSearchQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("初期マウント直後: isLoading=true, data=null, error=null", () => {
    const searchRequest = createDeferred<ApiSearchResponse>();
    fetchSearchHeritagesResultMock.mockImplementation(() => searchRequest.promise);

    const urlParams = makeParams({ search_query: "Japan", current_page: 1, per_page: 30 });
    const { result } = renderHook(() => useHeritageSearchQuery(urlParams));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  test("成功パス: fetch -> state 反映", async () => {
    const searchRequest = createDeferred<ApiSearchResponse>();
    fetchSearchHeritagesResultMock.mockImplementation(() => searchRequest.promise);

    const urlParams = makeParams({
      search_query: "Japan",
      region: "Asia",
      category: "Cultural",
      year_inscribed_from: 1990,
      year_inscribed_to: 2000,
      current_page: 1,
      per_page: 30,
      order: null,
    });

    const { result } = renderHook(() => useHeritageSearchQuery(urlParams));

    await act(async () => {
      searchRequest.resolve(OK);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(OK);
      expect(result.current.error).toBe(null);
    });

    expect(fetchSearchHeritagesResultMock).toHaveBeenCalledTimes(1);

    const [calledParams, calledInit] = fetchSearchHeritagesResultMock.mock.calls[0];
    expect(calledParams).toEqual(toExpectedSearchParams(urlParams));
    expect(calledInit?.signal).toBeDefined();
  });

  test("通常エラー: error が保持される / isLoading=false", async () => {
    const searchRequest = createDeferred<ApiSearchResponse>();
    fetchSearchHeritagesResultMock.mockImplementation(() => searchRequest.promise);

    const urlParams = makeParams({ search_query: "Japan", current_page: 1, per_page: 30 });
    const { result } = renderHook(() => useHeritageSearchQuery(urlParams));

    const boom = new Error("boom");

    await act(async () => {
      searchRequest.reject(boom);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(boom);
    });
  });

  test("AbortError は無視される（error にしない）", async () => {
    const first = createDeferred<ApiSearchResponse>();
    const second = createDeferred<ApiSearchResponse>();

    const calls: Array<{ signal?: AbortSignal }> = [];

    fetchSearchHeritagesResultMock.mockImplementation((_params, init) => {
      calls.push({ signal: init?.signal });
      return calls.length === 1 ? first.promise : second.promise;
    });

    const initialUrlParams = makeParams({
      search_query: "Japan",
      current_page: 1,
      per_page: 30,
    });

    const { result, rerender } = renderHook(
      (params: HeritageSearchParams) => useHeritageSearchQuery(params),
      {
        initialProps: initialUrlParams,
      },
    );

    rerender(
      makeParams({
        search_query: "Japan",
        current_page: 2,
        per_page: 30,
      }),
    );

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
    const first = createDeferred<ApiSearchResponse>();
    const second = createDeferred<ApiSearchResponse>();

    const signals: Array<AbortSignal | undefined> = [];

    fetchSearchHeritagesResultMock.mockImplementation((_params, init) => {
      signals.push(init?.signal);
      return signals.length === 1 ? first.promise : second.promise;
    });

    const { result, rerender } = renderHook(
      (params: HeritageSearchParams) => useHeritageSearchQuery(params),
      {
        initialProps: makeParams({
          search_query: "Japan",
          current_page: 1,
          per_page: 30,
        }),
      },
    );

    rerender(
      makeParams({
        search_query: "Japan",
        current_page: 2,
        per_page: 30,
      }),
    );

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
    const searchRequest = createDeferred<ApiSearchResponse>();

    const captured: Array<AbortSignal | undefined> = [];
    fetchSearchHeritagesResultMock.mockImplementation((_params, init) => {
      captured.push(init?.signal);
      return searchRequest.promise;
    });

    const { unmount } = renderHook(() =>
      useHeritageSearchQuery(
        makeParams({
          search_query: "Japan",
          current_page: 1,
          per_page: 30,
        }),
      ),
    );

    unmount();

    expect(captured[0]).toBeDefined();
    expect(captured[0]?.aborted).toBe(true);
  });
});
