import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { createFavoritesApi } from "./favorites-api";
import type { AddFavoriteRequest } from "./favorites-api";
import type { ApiWorldHeritageDto } from "../../../../domain/types.ts";

type MockResponse = Pick<Response, "ok" | "status" | "json">;

let fetchSpy: jest.MockedFunction<typeof fetch>;

const API_BASE = "http://localhost:8700";
const TOKEN = "1|abcdef";
const FAVORITES_ENDPOINT = `${API_BASE}/api/v1/favorites`;

const makeAddedResponse = (): MockResponse => ({
  ok: true,
  status: 201,
  json: async () => ({ status: "success" }),
});

const makeNgResponse = (status: number): MockResponse => ({
  ok: false,
  status,
  json: async () => ({}),
});

const makeAddRequest = (overrides: Partial<AddFavoriteRequest> = {}): AddFavoriteRequest => ({
  world_heritage_id: 42,
  ...overrides,
});

const makeHeritageDto = (overrides: Partial<ApiWorldHeritageDto> = {}): ApiWorldHeritageDto => ({
  id: 1,
  official_name: "Official Name",
  name: "Name",
  heritage_name_jp: "名前",
  country: "Country",
  country_name_jp: "国名",
  region: "Europe",
  category: "Cultural",
  year_inscribed: 2000,
  latitude: 0,
  longitude: 0,
  is_endangered: false,
  criteria: ["i"],
  area_hectares: null,
  buffer_zone_hectares: null,
  short_description: "desc",
  short_description_jp: "説明",
  unesco_site_url: null,
  state_party: null,
  state_party_codes: [],
  state_parties_meta: {},
  thumbnail_url: null,
  ...overrides,
});

describe("createFavoritesApi", () => {
  let api: ReturnType<typeof createFavoritesApi>;

  beforeEach(() => {
    fetchSpy = jest.fn() as jest.MockedFunction<typeof fetch>;
    api = createFavoritesApi({ apiBase: API_BASE, fetchImpl: fetchSpy });
  });

  it("throws when apiBase is empty", () => {
    expect(() => createFavoritesApi({ apiBase: "", fetchImpl: fetchSpy })).toThrow(
      "apiBase is required",
    );
  });

  describe("addFavorite", () => {
    it("posts the request body with the bearer token", async () => {
      fetchSpy.mockResolvedValue(makeAddedResponse() as Response);

      const request = makeAddRequest();
      await api.addFavorite(request, TOKEN);

      expect(fetchSpy).toHaveBeenCalledWith(
        FAVORITES_ENDPOINT,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(request),
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          }),
        }),
      );
    });

    it("throws on HTTP error", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(404) as Response);

      await expect(api.addFavorite(makeAddRequest(), TOKEN)).rejects.toThrow("HTTP 404");
    });
  });

  describe("removeFavorite", () => {
    it("sends a DELETE request to the resource URL with the bearer token", async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        status: 204,
        json: async () => ({}),
      } as Response);

      await api.removeFavorite(42, TOKEN);

      expect(fetchSpy).toHaveBeenCalledWith(
        `${FAVORITES_ENDPOINT}/42`,
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Accept: "application/json",
            Authorization: `Bearer ${TOKEN}`,
          }),
        }),
      );
    });

    it("throws on HTTP error", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(404) as Response);

      await expect(api.removeFavorite(42, TOKEN)).rejects.toThrow("HTTP 404");
    });
  });

  describe("getFavorites", () => {
    it("fetches the list with the bearer token and returns the data", async () => {
      const heritages = [makeHeritageDto()];
      fetchSpy.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "success", data: heritages }),
      } as Response);

      const result = await api.getFavorites(TOKEN);

      expect(fetchSpy).toHaveBeenCalledWith(
        FAVORITES_ENDPOINT,
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Accept: "application/json",
            Authorization: `Bearer ${TOKEN}`,
          }),
        }),
      );
      expect(result).toEqual(heritages);
    });

    it("returns an empty array when there are no favorites", async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "success", data: [] }),
      } as Response);

      const result = await api.getFavorites(TOKEN);

      expect(result).toEqual([]);
    });

    it("throws on HTTP error", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(500) as Response);

      await expect(api.getFavorites(TOKEN)).rejects.toThrow("HTTP 500");
    });
  });
});
