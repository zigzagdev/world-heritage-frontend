/** @jest-environment jsdom */

import type { UserProfile } from "../../types";

const useGetUserMock = jest.fn();

jest.mock("../../hooks/use-get-user", () => ({
  useGetUser: (id: number) => useGetUserMock(id),
}));

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { UserGetContainer } from "../user-get-container";

const profile: UserProfile = {
  id: 1,
  firstName: "Taro",
  lastName: "Yamada",
  email: "taro@example.com",
  ageRange: "teens",
  subscriptionTier: "free",
  subscriptionExpiresAt: null,
};

const renderContainer = (id = "1") =>
  render(
    <MemoryRouter initialEntries={[`/users/${id}`]}>
      <LocaleProvider>
        <Routes>
          <Route path="/users/:id" element={<UserGetContainer />} />
        </Routes>
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("UserGetContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing while loading", () => {
    useGetUserMock.mockReturnValue({ data: null, isLoading: true, error: null });

    const { container } = renderContainer();

    expect(container).toBeEmptyDOMElement();
  });

  it("passes the numeric id from the route to useGetUser", () => {
    useGetUserMock.mockReturnValue({ data: profile, isLoading: false, error: null });

    renderContainer("42");

    expect(useGetUserMock).toHaveBeenCalledWith(42);
  });

  it("renders the user profile on success", () => {
    useGetUserMock.mockReturnValue({ data: profile, isLoading: false, error: null });

    renderContainer();

    expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
    expect(screen.getByText("taro@example.com")).toBeInTheDocument();
  });

  it("shows an error panel when the hook reports an error", () => {
    useGetUserMock.mockReturnValue({ data: null, isLoading: false, error: new Error("boom") });

    renderContainer();

    expect(screen.getByText("Failed to load user.")).toBeInTheDocument();
  });

  it("shows an error panel when data is missing after loading", () => {
    useGetUserMock.mockReturnValue({ data: null, isLoading: false, error: null });

    renderContainer();

    expect(screen.getByText("Failed to load user.")).toBeInTheDocument();
  });
});
