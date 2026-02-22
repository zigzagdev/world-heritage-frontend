import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { createTopApi } from "./top-api";
import type { ApiWorldHeritageDto, ListResult, Pagination } from "../../../../domain/types.ts";

type MockResponse = Pick<Response, "ok" | "status" | "json">;

let fetchSpy: jest.MockedFunction<typeof fetch>;

const API_BASE = process.env.VITE_API_BASE_URL ?? "http://localhost:8700";
const EXPECTED_URL = `${API_BASE.replace(/\/+$/, "")}/api/v1/heritages`;

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

const makeDto = (overrides: Partial<ApiWorldHeritageDto> = {}): ApiWorldHeritageDto => ({
  id: 1,
  official_name: "Official",
  name: "Name",
  heritage_name_jp: "名称",
  country: "Japan",
  country_name_jp: "日本",
  region: "Asia",
  category: "Cultural",
  year_inscribed: 1993,
  latitude: null,
  longitude: null,
  is_endangered: false,
  criteria: ["i"],
  area_hectares: null,
  buffer_zone_hectares: null,
  short_description: "",
  unesco_site_url: "https://ex.com/1",
  state_party: null,
  state_party_codes: ["JPN"],
  state_parties_meta: [],
  thumbnail: null,
  ...overrides,
});

const makeListResponse = (items: ApiWorldHeritageDto[], pagination: Pagination | null = null) => ({
  status: "success",
  data: {
    items,
    pagination,
  } satisfies ListResult<ApiWorldHeritageDto>,
});

describe("fetchTopFirstPage (createTopApi)", () => {
  let api: ReturnType<typeof createTopApi>;

  beforeEach(() => {
    fetchSpy = jest.fn() as jest.MockedFunction<typeof fetch>;
    api = createTopApi({ apiBase: API_BASE, fetchImpl: fetchSpy });
  });

  it("returns json.data.items when status is success", async () => {
    const items = [makeDto({ id: 1 })];

    fetchSpy.mockResolvedValue(makeOkResponse(makeListResponse(items)) as Response);

    const out = await api.fetchTopFirstPage();

    expect(fetchSpy).toHaveBeenCalledWith(
      EXPECTED_URL,
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json" }),
        credentials: "omit",
      }),
    );
    expect(out).toEqual(items);
  });

  it("allows overriding headers/credentials/signal", async () => {
    fetchSpy.mockResolvedValue(makeOkResponse(makeListResponse([])) as Response);

    const ac = new AbortController();

    await api.fetchTopFirstPage({
      headers: { "X-Trace": "t" },
      credentials: "include",
      signal: ac.signal,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      EXPECTED_URL,
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

    await expect(api.fetchTopFirstPage()).rejects.toThrow("HTTP 500");
  });

  it("throws when API status is not success", async () => {
    fetchSpy.mockResolvedValue(
      makeOkResponse({
        status: "error",
        data: { items: [], pagination: null },
      }) as Response,
    );

    await expect(api.fetchTopFirstPage()).rejects.toThrow("API status is not success: error");
  });
});
