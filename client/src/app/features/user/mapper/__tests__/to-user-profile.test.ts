import { describe, it, expect } from "@jest/globals";
import { toUserProfile } from "../to-user-profile";
import type { ApiUserDto } from "../../apis/user-api";

const makeDto = (overrides: Partial<ApiUserDto> = {}): ApiUserDto => ({
  id: 1,
  first_name: "test",
  last_name: "1234",
  email: "test1234@example.com",
  age_range: "teens",
  subscription_tier: "free",
  subscription_expires_at: null,
  ...overrides,
});

describe("toUserProfile", () => {
  it("maps the snake_case API DTO to a camelCase UserProfile", () => {
    const profile = toUserProfile(makeDto());

    expect(profile).toEqual({
      id: 1,
      firstName: "test",
      lastName: "1234",
      email: "test1234@example.com",
      ageRange: "teens",
      subscriptionTier: "free",
      subscriptionExpiresAt: null,
    });
  });

  it("preserves a non-null subscriptionExpiresAt", () => {
    const profile = toUserProfile(makeDto({ subscription_expires_at: "2027-01-01" }));

    expect(profile.subscriptionExpiresAt).toBe("2027-01-01");
  });
});
