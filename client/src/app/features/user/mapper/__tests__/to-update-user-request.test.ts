import { describe, it, expect } from "@jest/globals";
import { toUpdateUserRequest } from "../to-update-user-request";
import type { UpdateUserFormValues } from "../to-update-user-request";

const makeFormValues = (overrides: Partial<UpdateUserFormValues> = {}): UpdateUserFormValues => ({
  firstName: "Taro",
  lastName: "Yamada",
  email: "taro@example.com",
  ...overrides,
});

describe("toUpdateUserRequest", () => {
  it("maps camelCase form values to snake_case request fields", () => {
    const request = toUpdateUserRequest(makeFormValues());

    expect(request).toEqual({
      first_name: "Taro",
      last_name: "Yamada",
      email: "taro@example.com",
    });
  });

  it("trims firstName, lastName, and email", () => {
    const request = toUpdateUserRequest(
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
});
