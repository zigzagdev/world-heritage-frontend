import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { createFavoritesApi } from "./favorites-api";
import type { AddFavoriteRequest } from "./favorites-api";

type MockResponse = Pick<Response, "ok" | "status" | "json">;

let fetchSpy: jest.MockedFunction<typeof fetch>;

const API_BASE = "http://localhost:8700";
const TOKEN = "1|abcdef";
const FAVORITES_ENDPOINT = `${API_BASE}/api/v1/users/me/favorites`;

const makeOkResponse = (): MockResponse => ({
  ok: true,
  status: 204,
  json: async () => ({}),
});

const makeNgResponse = (status: number): MockResponse => ({
  ok: false,
  status,
  json: async () => ({}),
});

const makeAddRequest = (overrides: Partial<AddFavoriteRequest> = {}): AddFavoriteRequest => ({
  user_id: 1,
  heritage_id: 42,
  is_liked: true,
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
      fetchSpy.mockResolvedValue(makeOkResponse() as Response);

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
      fetchSpy.mockResolvedValue(makeNgResponse(422) as Response);

      await expect(api.addFavorite(makeAddRequest(), TOKEN)).rejects.toThrow("HTTP 422");
    });
  });

  describe("removeFavorite", () => {
    it("deletes by heritage id with the bearer token", async () => {
      fetchSpy.mockResolvedValue(makeOkResponse() as Response);

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
});
