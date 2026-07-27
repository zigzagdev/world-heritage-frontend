import { describe, it, expect } from "@jest/globals";
import { toLoginRequest } from "../to-login-request";
import type { LoginFormValues } from "../../types";

const makeFormValues = (overrides: Partial<LoginFormValues> = {}): LoginFormValues => ({
  email: "taro@example.com",
  password: "password123",
  ...overrides,
});

describe("toLoginRequest", () => {
  it("maps form values to the login request", () => {
    const request = toLoginRequest(makeFormValues());

    expect(request).toEqual({
      email: "taro@example.com",
      password: "password123",
    });
  });

  it("trims email", () => {
    const request = toLoginRequest(makeFormValues({ email: "  taro@example.com  " }));

    expect(request.email).toBe("taro@example.com");
  });

  it("does not trim password", () => {
    const request = toLoginRequest(makeFormValues({ password: "  spaced out  " }));

    expect(request.password).toBe("  spaced out  ");
  });
});
