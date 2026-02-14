import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { createSearchApi } from "./search-api";
import type { ApiWorldHeritageDto } from "../../../../domain/types";

type MockResponse = Pick<Response, "ok" | "status" | "json">;

let fetchSpy: jest.MockedFunction<typeof fetch>;

const API_BASE = process.env.VITE_API_BASE_URL ?? "http://localhost:8700";
const ENDPOINT = `${API_BASE}/api/v1/heritages/search`;

const makeOkResponse = (body: unknown): MockResponse => ({
  ok: true,
  status: 200,
  json: async () => body,
});

const makeNgResponse = (status: number): MockResponse => ({
  ok: false,
  status,
  json: async () => ({}),
});

describe("searchHeritages (createSearchApi)", () => {
  let api: ReturnType<typeof createSearchApi>;

  beforeEach(() => {
    fetchSpy = jest.fn() as jest.MockedFunction<typeof fetch>;
    api = createSearchApi({ apiBase: API_BASE, fetchImpl: fetchSpy });
  });

  it("params無しならクエリ無しで叩く", async () => {
    const body = {
      status: "success",
      data: {
        data: [] as ApiWorldHeritageDto[],
        pagination: { current_page: 1, per_page: 30, total: 0, last_page: 1 },
      },
    } as const;

    fetchSpy.mockResolvedValue(makeOkResponse(body) as Response);

    const out = await api.searchHeritages({});

    expect(fetchSpy).toHaveBeenCalledWith(
      ENDPOINT,
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json" }),
        credentials: "omit",
      }),
    );

    expect(out).toEqual(body);
  });

  it("paramsがある場合はクエリを組み立てて叩く", async () => {
    const body = {
      status: "success",
      data: {
        data: [] as ApiWorldHeritageDto[],
        pagination: { current_page: 2, per_page: 10, total: 123, last_page: 13 },
      },
    } as const;

    fetchSpy.mockResolvedValue(makeOkResponse(body) as Response);

    const out = await api.searchHeritages({
      keyword: "Japan",
      region: "APA",
      category: "Cultural",
      page: 2,
      perPage: 10,
    });

    const expectedUrl =
      `${ENDPOINT}?` + `search_query=Japan&region=APA&category=Cultural&page=2&per_page=10`;

    expect(fetchSpy).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json" }),
        credentials: "omit",
      }),
    );

    expect(out).toEqual(body);
  });

  it("headers/credentials/signal が引数で上書きされる", async () => {
    const body = {
      status: "success",
      data: {
        data: [] as ApiWorldHeritageDto[],
        pagination: { current_page: 1, per_page: 30, total: 0, last_page: 1 },
      },
    } as const;

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

  it("HTTP エラー時は例外を投げる", async () => {
    fetchSpy.mockResolvedValue(makeNgResponse(500) as Response);

    await expect(api.searchHeritages({ keyword: "Japan" })).rejects.toThrow("HTTP 500");
  });

  it("status !== success の場合は例外を投げる", async () => {
    const body = {
      status: "error",
      data: {
        data: [] as ApiWorldHeritageDto[],
        pagination: { current_page: 1, per_page: 30, total: 0, last_page: 1 },
      },
    } as const;

    fetchSpy.mockResolvedValue(makeOkResponse(body) as Response);

    await expect(api.searchHeritages({ keyword: "Japan" })).rejects.toThrow(
      "API status is not success: error",
    );
  });
});
