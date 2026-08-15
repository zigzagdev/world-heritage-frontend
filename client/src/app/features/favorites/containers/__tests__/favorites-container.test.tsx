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

jest.mock("@features/top/components/HeritageList.tsx", () => ({
  __esModule: true,
  HeritageList: function MockHeritageList(props: {
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
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { FavoritesContainer } from "../favorites-container";

const renderContainer = () =>
  render(
    <MemoryRouter>
      <LocaleProvider>
        <FavoritesContainer />
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("FavoritesContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("renders the favorited world heritage sites and navigates to the detail page on click", () => {
    const items = [{ id: 1, title: "Site A" } as unknown as WorldHeritageVm];
    useFavoritesMock.mockReturnValue({
      data: items,
      reload: jest.fn(),
      isLoading: false,
      error: null,
    });

    renderContainer();

    fireEvent.click(screen.getByRole("button", { name: "Site A" }));
    expect(navigateMock).toHaveBeenCalledWith("/heritages/1");
  });
});
