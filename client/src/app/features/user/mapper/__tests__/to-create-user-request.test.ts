import { describe, it, expect } from "@jest/globals";
import { toCreateUserRequest } from "../to-create-user-request";
import type { CreateUserFormValues } from "../../types";

const makeFormValues = (overrides: Partial<CreateUserFormValues> = {}): CreateUserFormValues => ({
  firstName: "Taro",
  lastName: "Yamada",
  email: "taro@example.com",
  password: "password123",
  ...overrides,
});

describe("toCreateUserRequest", () => {
  it("maps camelCase form values to snake_case request fields", () => {
    const request = toCreateUserRequest(makeFormValues());

    expect(request).toEqual({
      first_name: "Taro",
      last_name: "Yamada",
      email: "taro@example.com",
      password: "password123",
    });
  });

  it("trims firstName, lastName, and email", () => {
    const request = toCreateUserRequest(
      makeFormValues({
        firstName: "  Taro  ",
        lastName: "  Yamada  ",
        email: "  taro@example.com  ",
      }),
    );

    expect(request.first_name).toBe("Taro");
    expect(request.last_name).toBe("Yamada");
    expect(request.email).toBe("taro@example.com");
  });

  it("does not trim password", () => {
    const request = toCreateUserRequest(makeFormValues({ password: "  spaced out  " }));

    expect(request.password).toBe("  spaced out  ");
  });
});
