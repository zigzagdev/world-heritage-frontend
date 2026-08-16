/** @jest-environment jsdom */

import "@testing-library/jest-dom/jest-globals";
import { jest } from "@jest/globals";
import type { WorldHeritageVm } from "../../../../../domain/types.ts";

const navigateMock = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom") as object;
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const useFavoritesMock = jest.fn();

jest.mock("../../hooks/use-favorites", () => ({
  useFavorites: () => useFavoritesMock(),
}));

const useAuthMock = jest.fn();

jest.mock("@shared/auth/AuthHooks.ts", () => ({
  useAuth: () => useAuthMock(),
}));

jest.mock("../../components/FavoriteList", () => ({
  __esModule: true,
  FavoriteList: function MockFavoriteList(props: {
    items: ReadonlyArray<WorldHeritageVm>;
    onClickItem?: (id: number) => void;
  }) {
    return (
      <ul>
        {props.items.map((it) => (
          <li key={it.id}>
            <button type="button" onClick={() => props.onClickItem?.(it.id)}>
              {it.title}
            </button>
          </li>
        ))}
      </ul>
    );
  },
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { FavoritesContainer } from "../favorites-container";

const renderContainer = (path = "/users/1/favorite-list") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LocaleProvider>
        <Routes>
          <Route path="/users/:id/favorite-list" element={<FavoritesContainer />} />
        </Routes>
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("FavoritesContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthMock.mockReturnValue({ user: { id: 1 } });
  });

  it("shows a spinner when the authenticated user isn't resolved yet", () => {
    useAuthMock.mockReturnValue({ user: null });
    useFavoritesMock.mockReturnValue({
      data: [],
      reload: jest.fn(),
      isLoading: true,
      error: null,
    });

    renderContainer();

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("shows an access-denied dialog without fetching data when the URL id doesn't match, and returns to the top page", () => {
    renderContainer("/users/999/favorite-list");

    expect(screen.getByRole("heading", { name: "Access Denied" })).toBeInTheDocument();
    expect(screen.getByText("You can only view your own favorites.")).toBeInTheDocument();
    expect(useFavoritesMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Back to all sites" }));
    expect(navigateMock).toHaveBeenCalledWith("/heritages", { replace: true });
  });

  it("shows a spinner while loading", () => {
    useFavoritesMock.mockReturnValue({
      data: [],
      reload: jest.fn(),
      isLoading: true,
      error: null,
    });

    renderContainer();

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("shows an error panel with a retry action on error", () => {
    const reloadMock = jest.fn();
    useFavoritesMock.mockReturnValue({
      data: [],
      reload: reloadMock,
      isLoading: false,
      error: new Error("boom"),
    });

    renderContainer();

    expect(screen.getByText("boom")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it("renders the title bar and the favorited world heritage sites, navigating to the detail page on click", () => {
    const items = [{ id: 1, title: "Site A" } as unknown as WorldHeritageVm];
    useFavoritesMock.mockReturnValue({
      data: items,
      reload: jest.fn(),
      isLoading: false,
      error: null,
    });

    renderContainer();

    expect(screen.getByRole("heading", { name: "Favorites List" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Site A" }));
    expect(navigateMock).toHaveBeenCalledWith("/heritages/1");
  });
});
