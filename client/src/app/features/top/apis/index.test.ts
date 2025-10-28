import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { fetchTopFirstPage } from "./index.js";
import type { ApiWorldHeritageDto, Paginated } from "../types";

let fetchSpy: jest.SpiedFunction<typeof fetch>;
beforeEach(() => {
  if (fetchSpy) fetchSpy.mockRestore();
  fetchSpy = jest.spyOn(globalThis, "fetch");
});

type MockResponse = Pick<Response, "ok" | "status" | "json">;

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
        thumbnail: null,
      },
    ];
    const okRes: MockResponse = { ok: true, status: 200, json: async () => data };
    fetchSpy.mockResolvedValue(okRes as unknown as Response);

    const out = await fetchTopFirstPage();

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/world-heritage?page=1&per_page=20",
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json" }),
        credentials: "omit",
      }),
    );
    expect(out).toEqual(data);
  });

  it("{data: ...} レスポンスも配列に正規化して返す", async () => {
    const paginated: Paginated<ApiWorldHeritageDto> = { data: [] };
    const okRes: MockResponse = { ok: true, status: 200, json: async () => paginated };
    fetchSpy.mockResolvedValue(okRes as unknown as Response);

    const out = await fetchTopFirstPage();

    expect(Array.isArray(out)).toBe(true);
    expect(out).toEqual([]);
  });

  it("headers/credentials/signal が引数で上書きされる", async () => {
    const ac = new AbortController();
    const okRes: MockResponse = { ok: true, status: 200, json: async () => [] };
    fetchSpy.mockResolvedValue(okRes as unknown as Response);

    await fetchTopFirstPage({
      headers: { "X-Trace": "t" },
      credentials: "include",
      signal: ac.signal,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/world-heritage?page=1&per_page=20",
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json", "X-Trace": "t" }),
        credentials: "include",
        signal: ac.signal,
      }),
    );
  });

  it("HTTP エラー時は例外を投げる", async () => {
    const ngRes: MockResponse = { ok: false, status: 500, json: async () => ({}) };
    fetchSpy.mockResolvedValue(ngRes as unknown as Response);

    await expect(fetchTopFirstPage()).rejects.toThrow("HTTP 500");
  });
});
