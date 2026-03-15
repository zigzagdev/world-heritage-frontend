import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { createSearchApi } from "./search-api";
import type { ApiWorldHeritageDto, ListResult, Pagination } from "../../../../domain/types";

type MockResponse = Pick<Response, "ok" | "status" | "json">;

let fetchSpy: jest.MockedFunction<typeof fetch>;

const API_BASE = "http://localhost:8700";
const ENDPOINT = `${API_BASE.replace(/\/+$/, "")}/api/v1/heritages/search`;

type ApiSearchResponse = {
  status: "success" | "error";
  data: {
    items: ApiWorldHeritageDto[];
    pagination: Pagination;
  };
};

const makeOkResponse = (body: ApiSearchResponse): MockResponse => ({
  ok: true,
  status: 200,
  json: async () => body,
});

const makeNgResponse = (status: number): MockResponse => ({
  ok: false,
  status,
  json: async () => ({}),
});

const makePagination = (overrides: Partial<Pagination> = {}): Pagination => ({
  current_page: 1,
  per_page: 30,
  total: 0,
  last_page: 1,
  ...overrides,
});

describe("createSearchApi", () => {
  let api: ReturnType<typeof createSearchApi>;

  beforeEach(() => {
    fetchSpy = jest.fn() as jest.MockedFunction<typeof fetch>;
    api = createSearchApi({ apiBase: API_BASE, fetchImpl: fetchSpy });
  });

  describe("searchHeritages", () => {
    it("calls endpoint without query when params are empty", async () => {
      const body: ApiSearchResponse = {
        status: "success",
        data: {
          items: [],
          pagination: makePagination(),
        },
      };

      fetchSpy.mockResolvedValue(makeOkResponse(body) as Response);

      const out: ListResult<ApiWorldHeritageDto> = await api.searchHeritages({});

      expect(fetchSpy).toHaveBeenCalledWith(
        ENDPOINT,
        expect.objectContaining({
          headers: expect.objectContaining({ Accept: "application/json" }),
          credentials: "omit",
        }),
      );

      expect(out).toEqual({
        items: [],
        pagination: makePagination(),
      });
    });

    it("builds query string when params are provided", async () => {
      const body: ApiSearchResponse = {
        status: "success",
        data: {
          items: [],
          pagination: makePagination({
            current_page: 2,
            per_page: 10,
            total: 123,
            last_page: 13,
          }),
        },
      };

      fetchSpy.mockResolvedValue(makeOkResponse(body) as Response);

      const out = await api.searchHeritages({
        keyword: "Japan",
        region: "Asia",
        category: "Cultural",
        currentPage: 2,
        perPage: 10,
      });

      const expectedUrl = `${ENDPOINT}?search_query=Japan&region=Asia&category=Cultural&current_page=2&per_page=10`;

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          headers: expect.objectContaining({ Accept: "application/json" }),
          credentials: "omit",
        }),
      );

      expect(out).toEqual({
        items: [],
        pagination: makePagination({
          current_page: 2,
          per_page: 10,
          total: 123,
          last_page: 13,
        }),
      });
    });

    it("merges headers and allows credentials and signal override", async () => {
      const body: ApiSearchResponse = {
        status: "success",
        data: {
          items: [],
          pagination: makePagination(),
        },
      };

      fetchSpy.mockResolvedValue(makeOkResponse(body) as Response);

      const ac = new AbortController();

      await api.searchHeritages(
        { keyword: "Japan" },
        {
          headers: { "X-Trace": "t" },
          credentials: "include",
          signal: ac.signal,
        },
      );

      const expectedUrl = `${ENDPOINT}?search_query=Japan`;

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "X-Trace": "t",
          }),
          credentials: "include",
          signal: ac.signal,
        }),
      );
    });

    it("throws on HTTP error", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(500) as Response);

      await expect(api.searchHeritages({ keyword: "Japan" })).rejects.toThrow("HTTP 500");
    });

    it("throws when API status is not success", async () => {
      const body: ApiSearchResponse = {
        status: "error",
        data: {
          items: [],
          pagination: makePagination(),
        },
      };

      fetchSpy.mockResolvedValue(makeOkResponse(body) as Response);

      await expect(api.searchHeritages({ keyword: "Japan" })).rejects.toThrow(
        "API status is not success: error",
      );
    });

    it("trims trailing slash from apiBase", async () => {
      const apiWithTrailingSlash = createSearchApi({
        apiBase: "http://localhost:8700/",
        fetchImpl: fetchSpy,
      });

      const body: ApiSearchResponse = {
        status: "success",
        data: {
          items: [],
          pagination: makePagination(),
        },
      };

      fetchSpy.mockResolvedValue(makeOkResponse(body) as Response);

      await apiWithTrailingSlash.searchHeritages({ keyword: "Japan" });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${ENDPOINT}?search_query=Japan`,
        expect.objectContaining({
          headers: expect.objectContaining({ Accept: "application/json" }),
          credentials: "omit",
        }),
      );
    });
  });
});
