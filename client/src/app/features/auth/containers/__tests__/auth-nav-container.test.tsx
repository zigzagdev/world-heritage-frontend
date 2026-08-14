/** @jest-environment jsdom */

const useAuthMock = jest.fn();
const useLogoutMock = jest.fn();

jest.mock("@shared/auth/AuthHooks.ts", () => ({
  useAuth: () => useAuthMock(),
}));

jest.mock("../../hooks/use-logout", () => ({
  useLogout: () => useLogoutMock(),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { AuthNavContainer } from "../auth-nav-container";

const renderNav = () =>
  render(
    <MemoryRouter>
      <LocaleProvider>
        <AuthNavContainer />
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("AuthNavContainer", () => {
  const submitMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useLogoutMock.mockReturnValue({ submit: submitMock, isLoading: false, error: null });
  });

  it("renders nothing while the auth state is still loading", () => {
    useAuthMock.mockReturnValue({ user: null, isLoading: true });

    renderNav();

    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "My Page" })).not.toBeInTheDocument();
  });

  it("shows a Login link when unauthenticated", () => {
    useAuthMock.mockReturnValue({ user: null, isLoading: false });

    renderNav();

    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("button", { name: "Log out" })).not.toBeInTheDocument();
  });

  it("shows My Page, Favorites and Logout when authenticated", () => {
    useAuthMock.mockReturnValue({
      user: { id: 1, first_name: "Taro", last_name: "Yamada", email: "taro@example.com" },
      isLoading: false,
    });

    renderNav();

    expect(screen.getByRole("link", { name: "My Page" })).toHaveAttribute("href", "/mypage");
    expect(screen.getByRole("link", { name: "Favorites" })).toHaveAttribute(
      "href",
      "/favorites-list",
    );
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  it("calls useLogout's submit when Logout is clicked", async () => {
    useAuthMock.mockReturnValue({
      user: { id: 1, first_name: "Taro", last_name: "Yamada", email: "taro@example.com" },
      isLoading: false,
    });
    submitMock.mockResolvedValue(true);

    renderNav();

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1));
  });
});
