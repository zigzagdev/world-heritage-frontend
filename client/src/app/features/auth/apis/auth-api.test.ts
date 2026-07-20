import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { createAuthApi } from "./auth-api";
import type { ApiCurrentUserDto } from "./auth-api";

type MockResponse = Pick<Response, "ok" | "status" | "json">;

let fetchSpy: jest.MockedFunction<typeof fetch>;

const API_BASE = "http://localhost:8700";
const TOKEN = "1|abcdef";

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

const makeUser = (overrides: Partial<ApiCurrentUserDto> = {}): ApiCurrentUserDto => ({
  id: 1,
  first_name: "Taro",
  last_name: "Yamada",
  email: "taro@example.com",
  ...overrides,
});

describe("createAuthApi", () => {
  let api: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    fetchSpy = jest.fn() as jest.MockedFunction<typeof fetch>;
    api = createAuthApi({ apiBase: API_BASE, fetchImpl: fetchSpy });
  });

  it("throws when apiBase is empty", () => {
    expect(() => createAuthApi({ apiBase: "", fetchImpl: fetchSpy })).toThrow(
      "apiBase is required",
    );
  });

  describe("login", () => {
    it("posts credentials and returns the bearer token from the envelope", async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse({ status: "success", data: { token: TOKEN, token_type: "Bearer" } }) as Response,
      );

      const result = await api.login({ email: "taro@example.com", password: "password123" });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${API_BASE}/api/v1/user/login`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "taro@example.com", password: "password123" }),
        }),
      );
      expect(result).toEqual({ token: TOKEN, tokenType: "Bearer" });
    });

    it("throws on HTTP error", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(422) as Response);

      await expect(
        api.login({ email: "taro@example.com", password: "wrong" }),
      ).rejects.toThrow("HTTP 422");
    });
  });

  describe("logout", () => {
    it("posts to the logout endpoint with the bearer token", async () => {
      fetchSpy.mockResolvedValue(makeOkResponse({}) as Response);

      await api.logout(TOKEN);

      expect(fetchSpy).toHaveBeenCalledWith(
        `${API_BASE}/api/v1/user/logout`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({ Authorization: `Bearer ${TOKEN}` }),
        }),
      );
    });
  });

  describe("getCurrentUser", () => {
    it("returns the current user on success", async () => {
      const user = makeUser();
      fetchSpy.mockResolvedValue(makeOkResponse({ status: "success", data: user }) as Response);

      const result = await api.getCurrentUser(TOKEN);

      expect(fetchSpy).toHaveBeenCalledWith(
        `${API_BASE}/api/v1/user/me`,
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({ Authorization: `Bearer ${TOKEN}` }),
        }),
      );
      expect(result).toEqual(user);
    });

    it("returns null when unauthenticated (401)", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(401) as Response);

      const result = await api.getCurrentUser(TOKEN);

      expect(result).toBeNull();
    });

    it("throws on other HTTP errors", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(500) as Response);

      await expect(api.getCurrentUser(TOKEN)).rejects.toThrow("HTTP 500");
    });
  });
});