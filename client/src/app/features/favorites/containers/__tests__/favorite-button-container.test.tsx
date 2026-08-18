/** @jest-environment jsdom */

import "@testing-library/jest-dom/jest-globals";
import { jest } from "@jest/globals";

const submitAddMock = jest.fn<() => Promise<boolean>>();
const submitRemoveMock = jest.fn<() => Promise<boolean>>();
let useAddFavoriteReturn: { submit: typeof submitAddMock; isLoading: boolean };
let useRemoveFavoriteReturn: { submit: typeof submitRemoveMock; isLoading: boolean };
let useFavoritesLookupReturn: { isFavorited: (id: number) => boolean; isLoading: boolean };
let useAuthReturn: { user: { id: number } | null };

jest.mock("../../hooks/use-add-favorite", () => ({
  useAddFavorite: () => useAddFavoriteReturn,
}));

jest.mock("../../hooks/use-remove-favorite", () => ({
  useRemoveFavorite: () => useRemoveFavoriteReturn,
}));

jest.mock("../../hooks/use-favorites-lookup", () => ({
  useFavoritesLookup: () => useFavoritesLookupReturn,
}));

jest.mock("@shared/auth/AuthHooks.ts", () => ({
  useAuth: () => useAuthReturn,
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { FavoriteButtonContainer } from "../favorite-button-container";

describe("FavoriteButtonContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAddFavoriteReturn = { submit: submitAddMock, isLoading: false };
    useRemoveFavoriteReturn = { submit: submitRemoveMock, isLoading: false };
    useFavoritesLookupReturn = { isFavorited: () => false, isLoading: false };
    useAuthReturn = { user: { id: 1 } };
  });

  test("未ログインの場合は何も表示しない", () => {
    useAuthReturn = { user: null };

    const { container } = render(<FavoriteButtonContainer heritageId={42} />);

    expect(container).toBeEmptyDOMElement();
  });

  test("lookupで未登録の場合は未登録表示になり、クリックでaddのsubmitが呼ばれる", () => {
    submitAddMock.mockResolvedValue(true);

    render(<FavoriteButtonContainer heritageId={42} />);

    const button = screen.getByRole("button", { name: "Add to favorites" });
    fireEvent.click(button);

    expect(submitAddMock).toHaveBeenCalledWith(42);
    expect(submitRemoveMock).not.toHaveBeenCalled();
  });

  test("lookupで登録済みの場合は登録済み表示になり、クリックでremoveのsubmitが呼ばれる", () => {
    useFavoritesLookupReturn = { isFavorited: (id) => id === 42, isLoading: false };
    submitRemoveMock.mockResolvedValue(true);

    render(<FavoriteButtonContainer heritageId={42} />);

    const button = screen.getByRole("button", { name: "Favorited" });
    fireEvent.click(button);

    expect(submitRemoveMock).toHaveBeenCalledWith(42);
    expect(submitAddMock).not.toHaveBeenCalled();
  });

  test("add成功後は登録済み表示に切り替わる", async () => {
    submitAddMock.mockResolvedValue(true);

    render(<FavoriteButtonContainer heritageId={42} />);

    fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Favorited" })).toBeVisible());
  });

  test("remove成功後は未登録表示に切り替わる", async () => {
    useFavoritesLookupReturn = { isFavorited: (id) => id === 42, isLoading: false };
    submitRemoveMock.mockResolvedValue(true);

    render(<FavoriteButtonContainer heritageId={42} />);

    fireEvent.click(screen.getByRole("button", { name: "Favorited" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Add to favorites" })).toBeVisible(),
    );
  });

  test("add失敗時は未登録表示のまま", async () => {
    submitAddMock.mockResolvedValue(false);

    render(<FavoriteButtonContainer heritageId={42} />);

    fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));

    await waitFor(() => expect(submitAddMock).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeInTheDocument();
  });

  test("add/remove処理中はボタンが無効化される", () => {
    useAddFavoriteReturn = { submit: submitAddMock, isLoading: true };

    render(<FavoriteButtonContainer heritageId={42} />);

    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeDisabled();
  });
});
