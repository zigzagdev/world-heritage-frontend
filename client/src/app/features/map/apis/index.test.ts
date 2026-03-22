import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { createRegionCountApi } from "./region-count-api.ts";
import type { RegionCount } from "../../../../domain/types.ts";

type MockResponse = Pick<Response, "ok" | "status" | "json">;

let fetchSpy: jest.MockedFunction<typeof fetch>;

const API_BASE = "http://localhost:8700";
const ENDPOINT = `${API_BASE}/api/v1/heritages/region-count`;

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

const makeRegionCountResponse = (data: RegionCount[]) => ({
  status: "success",
  data,
});

const MOCK_REGION_COUNTS: RegionCount[] = [
  { region: "Africa", count: 92 },
  { region: "Asia", count: 263 },
  { region: "Europe", count: 542 },
  { region: "North America", count: 87 },
  { region: "South America", count: 103 },
  { region: "Oceania", count: 35 },
];

describe("createRegionCountApi", () => {
  let api: ReturnType<typeof createRegionCountApi>;

  beforeEach(() => {
    fetchSpy = jest.fn() as jest.MockedFunction<typeof fetch>;
    api = createRegionCountApi({ apiBase: API_BASE, fetchImpl: fetchSpy });
  });

  describe("fetchRegionCount", () => {
    it("calls the correct endpoint", async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse(makeRegionCountResponse(MOCK_REGION_COUNTS)) as Response,
      );

      await api.fetchRegionCount();

      expect(fetchSpy).toHaveBeenCalledWith(
        ENDPOINT,
        expect.objectContaining({
          headers: expect.objectContaining({ Accept: "application/json" }),
        }),
      );
    });

    it("returns RegionCount[] when status is success", async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse(makeRegionCountResponse(MOCK_REGION_COUNTS)) as Response,
      );

      const result = await api.fetchRegionCount();

      expect(result).toEqual(MOCK_REGION_COUNTS);
    });

    it("passes signal when provided", async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse(makeRegionCountResponse(MOCK_REGION_COUNTS)) as Response,
      );

      const abortController = new AbortController();
      await api.fetchRegionCount({ signal: abortController.signal });

      expect(fetchSpy).toHaveBeenCalledWith(
        ENDPOINT,
        expect.objectContaining({ signal: abortController.signal }),
      );
    });

    it("throws on HTTP error", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(500) as Response);

      await expect(api.fetchRegionCount()).rejects.toThrow("HTTP 500");
    });

    it("throws when API status is not success", async () => {
      fetchSpy.mockResolvedValue(makeOkResponse({ status: "error", data: [] }) as Response);

      await expect(api.fetchRegionCount()).rejects.toThrow("API status is not success: error");
    });
  });
});
