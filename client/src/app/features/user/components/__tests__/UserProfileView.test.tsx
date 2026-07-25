/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { UserProfileView } from "../UserProfileView";
import type { UserProfile } from "../../types";

const profile: UserProfile = {
  id: 1,
  firstName: "Taro",
  lastName: "Yamada",
  email: "taro@example.com",
  ageRange: "teens",
  subscriptionTier: "free",
  subscriptionExpiresAt: null,
};

const renderView = (overrides: Partial<UserProfile> = {}) =>
  render(
    <MemoryRouter>
      <LocaleProvider>
        <UserProfileView profile={{ ...profile, ...overrides }} />
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("UserProfileView", () => {
  it("renders the avatar initials from first and last name", () => {
    renderView();

    expect(screen.getByText("TY")).toBeInTheDocument();
  });

  it("renders the full name and email", () => {
    renderView();

    expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
    expect(screen.getAllByText("taro@example.com").length).toBeGreaterThan(0);
  });

  it("renders a profile row for each field", () => {
    renderView();

    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Age Range")).toBeInTheDocument();
    expect(screen.getByText("teens")).toBeInTheDocument();
    expect(screen.getByText("Subscription")).toBeInTheDocument();
    expect(screen.getByText("free")).toBeInTheDocument();
  });
});
