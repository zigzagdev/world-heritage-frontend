import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { createTopApi } from "./top-api";
import type { ApiWorldHeritageDto, ListResult, Pagination } from "../../../../domain/types.ts";

type MockResponse = Pick<Response, "ok" | "status" | "json">;

let fetchSpy: jest.MockedFunction<typeof fetch>;

const API_BASE = "http://localhost:8700";
const ENDPOINT = `${API_BASE.replace(/\/+$/, "")}/api/v1/heritages`;

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
  state_parties_meta: {},
  thumbnail: null,
  ...overrides,
});

const makePagination = (overrides: Partial<Pagination> = {}): Pagination => ({
  current_page: 1,
  per_page: 30,
  total: 1,
  last_page: 1,
  ...overrides,
});

const makeListResponse = (items: ApiWorldHeritageDto[], pagination: Pagination) => ({
  status: "success",
  data: {
    items,
    pagination,
  } satisfies ListResult<ApiWorldHeritageDto>,
});

describe("createTopApi", () => {
  let api: ReturnType<typeof createTopApi>;

  beforeEach(() => {
    fetchSpy = jest.fn() as jest.MockedFunction<typeof fetch>;
    api = createTopApi({ apiBase: API_BASE, fetchImpl: fetchSpy });
  });

  describe("fetchTopPage", () => {
    it("returns json.data when status is success", async () => {
      const items = [makeDto({ id: 1 })];
      const pagination = makePagination({ total: 1, last_page: 1 });

      fetchSpy.mockResolvedValue(makeOkResponse(makeListResponse(items, pagination)) as Response);

      const out = await api.fetchTopPage({ currentPage: 1, perPage: 30 });

      const expectedUrl = `${ENDPOINT}?current_page=1&per_page=30`;

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          headers: expect.objectContaining({ Accept: "application/json" }),
          credentials: "omit",
        }),
      );

      expect(out).toEqual({ items, pagination });
    });

    it("passes signal when provided", async () => {
      const items: ApiWorldHeritageDto[] = [];
      const pagination = makePagination({ total: 0, last_page: 1 });

      fetchSpy.mockResolvedValue(makeOkResponse(makeListResponse(items, pagination)) as Response);

      const abortController = new AbortController();

      await api.fetchTopPage({
        currentPage: 1,
        perPage: 30,
        signal: abortController.signal,
      });

      const expectedUrl = `${ENDPOINT}?current_page=1&per_page=30`;

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          headers: expect.objectContaining({ Accept: "application/json" }),
          credentials: "omit",
          signal: abortController.signal,
        }),
      );
    });

    it("throws on HTTP error", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(500) as Response);

      await expect(
        api.fetchTopPage({
          currentPage: 1,
          perPage: 30,
          signal: new AbortController().signal,
        }),
      ).rejects.toThrow("HTTP 500");
    });

    it("throws when API status is not success", async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse({ status: "error", data: { items: [], pagination: null } }) as Response,
      );

      await expect(
        api.fetchTopPage({
          currentPage: 1,
          perPage: 30,
          signal: new AbortController().signal,
        }),
      ).rejects.toThrow("API status is not success: error");
    });
  });
});
