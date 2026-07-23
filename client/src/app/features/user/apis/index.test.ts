import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { createUserApi } from "./user-api";
import type { ApiCreateUserResponse, ApiUserDto, CreateUserRequest } from "./user-api";

type MockResponse = Pick<Response, "ok" | "status" | "json">;

let fetchSpy: jest.MockedFunction<typeof fetch>;

const API_BASE = "http://localhost:8700";
const ENDPOINT = `${API_BASE.replace(/\/+$/, "")}/api/v1/users`;

const makeOkResponse = (body: ApiCreateUserResponse): MockResponse => ({
  ok: true,
  status: 200,
  json: async () => body,
});

const makeNgResponse = (status: number): MockResponse => ({
  ok: false,
  status,
  json: async () => ({}),
});

const makeRequest = (overrides: Partial<CreateUserRequest> = {}): CreateUserRequest => ({
  first_name: "Taro",
  last_name: "Yamada",
  email: "taro@example.com",
  password: "password123",
  ...overrides,
});

const makeUserDto = (overrides: Partial<ApiUserDto> = {}): ApiUserDto => ({
  id: 1,
  first_name: "Taro",
  last_name: "Yamada",
  email: "taro@example.com",
  age_range: "teens",
  subscription_tier: "free",
  subscription_expires_at: null,
  ...overrides,
});

describe("createUserApi", () => {
  let api: ReturnType<typeof createUserApi>;

  beforeEach(() => {
    fetchSpy = jest.fn() as jest.MockedFunction<typeof fetch>;
    api = createUserApi({ apiBase: API_BASE, fetchImpl: fetchSpy });
  });

  describe("createUser", () => {
    it("posts the request body to the users endpoint", async () => {
      const user = makeUserDto();
      fetchSpy.mockResolvedValue(makeOkResponse({ status: "success", data: user }) as Response);

      const request = makeRequest();
      const out = await api.createUser(request);

      expect(fetchSpy).toHaveBeenCalledWith(
        ENDPOINT,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(request),
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
          credentials: "omit",
        }),
      );
      expect(out).toEqual(user);
    });

    it("trims trailing slash from apiBase", async () => {
      const apiWithTrailingSlash = createUserApi({
        apiBase: "http://localhost:8700/",
        fetchImpl: fetchSpy,
      });
      const user = makeUserDto();
      fetchSpy.mockResolvedValue(makeOkResponse({ status: "success", data: user }) as Response);

      await apiWithTrailingSlash.createUser(makeRequest());

      expect(fetchSpy).toHaveBeenCalledWith(ENDPOINT, expect.objectContaining({ method: "POST" }));
    });

    it("merges headers and allows credentials and signal override", async () => {
      const user = makeUserDto();
      fetchSpy.mockResolvedValue(makeOkResponse({ status: "success", data: user }) as Response);

      const ac = new AbortController();
      await api.createUser(makeRequest(), {
        headers: { "X-Trace": "t" },
        credentials: "include",
        signal: ac.signal,
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        ENDPOINT,
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Trace": "t",
          }),
          credentials: "include",
          signal: ac.signal,
        }),
      );
    });

    it("throws on HTTP error", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(422) as Response);

      await expect(api.createUser(makeRequest())).rejects.toThrow("HTTP 422");
    });

    it("throws when API status is not success", async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse({ status: "error", data: { message: "invalid" } }) as Response,
      );

      await expect(api.createUser(makeRequest())).rejects.toThrow(
        "API status is not success: error",
      );
    });
  });

  describe("getUser", () => {
    it("gets the user by id", async () => {
      const user = makeUserDto();
      fetchSpy.mockResolvedValue(makeOkResponse({ status: "success", data: user }) as Response);

      const out = await api.getUser(1);

      expect(fetchSpy).toHaveBeenCalledWith(
        `${ENDPOINT}/1`,
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({ Accept: "application/json" }),
          credentials: "omit",
        }),
      );
      expect(out).toEqual(user);
    });

    it("throws on HTTP error", async () => {
      fetchSpy.mockResolvedValue(makeNgResponse(404) as Response);

      await expect(api.getUser(1)).rejects.toThrow("HTTP 404");
    });

    it("throws when API status is not success", async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse({ status: "error", data: { message: "not found" } }) as Response,
      );

      await expect(api.getUser(1)).rejects.toThrow("API status is not success: error");
    });
  });

  it("throws when apiBase is empty", () => {
    expect(() => createUserApi({ apiBase: "", fetchImpl: fetchSpy })).toThrow(
      "apiBase is required",
    );
  });
});
