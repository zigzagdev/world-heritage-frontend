import { describe, it, expect, beforeEach, beforeAll, afterAll, jest } from "@jest/globals";
import { fetchTopFirstPage } from "./index.js";
import type { ApiWorldHeritageDto, Paginated } from "../types";

type MockResponse = Pick<Response, "ok" | "status" | "json">;
type GlobalWithFetch = typeof globalThis & { fetch?: typeof fetch };

const g = globalThis as GlobalWithFetch;

let fetchSpy: jest.MockedFunction<typeof fetch>;
let originalFetch: typeof fetch | undefined;

beforeAll(() => {
  originalFetch = g.fetch;
});

beforeEach(() => {
  fetchSpy = jest.fn() as jest.MockedFunction<typeof fetch>;
  g.fetch = fetchSpy;
});

afterAll(() => {
  if (originalFetch) {
    g.fetch = originalFetch;
  }
});

const API_BASE = process.env.VITE_API_BASE_URL ?? "http://localhost:8700";
const EXPECTED_URL = `${API_BASE}/api/v1/heritages`;

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

describe("fetchTopFirstPage", () => {
  it("return array response", async () => {
    const data: ApiWorldHeritageDto[] = [
      {
        id: 1,
        official_name: "A",
        name: "A",
        name_jp: "A",
        country: "X",
        region: "Y",
        state_party: "JPN",
        category: "Cultural",
        criteria: ["i"],
        year_inscribed: 1993,
        area_hectares: null,
        buffer_zone_hectares: null,
        is_endangered: false,
        latitude: null,
        longitude: null,
        short_description: "",
        unesco_site_url: "https://ex.com/1",
        state_party_codes: ["JPN"],
        state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
        thumbnail_url: null,
        primary_state_party_code: "JPN",
      },
    ];

    fetchSpy.mockResolvedValue(makeOkResponse(data) as Response);

    const out = await fetchTopFirstPage();

    expect(fetchSpy).toHaveBeenCalledWith(
      EXPECTED_URL,
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json" }),
        credentials: "omit",
      }),
    );
    expect(out).toEqual(data);
  });

  it("{data: ...} レスポンスも配列に正規化して返す", async () => {
    const paginated: Paginated<ApiWorldHeritageDto> = { data: [] };
    fetchSpy.mockResolvedValue(makeOkResponse(paginated) as Response);

    const out = await fetchTopFirstPage();

    expect(Array.isArray(out)).toBe(true);
    expect(out).toEqual([]);
  });

  it("headers/credentials/signal が引数で上書きされる", async () => {
    const paginated: Paginated<ApiWorldHeritageDto> = { data: [] };
    fetchSpy.mockResolvedValue(makeOkResponse(paginated) as Response);

    const ac = new AbortController();

    await fetchTopFirstPage({
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

  it("HTTP エラー時は例外を投げる", async () => {
    fetchSpy.mockResolvedValue(makeNgResponse(500) as Response);

    await expect(fetchTopFirstPage()).rejects.toThrow("HTTP 500");
  });
});
