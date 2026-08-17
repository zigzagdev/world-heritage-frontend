/** @jest-environment jsdom */

import "@testing-library/jest-dom/jest-globals";
import { jest } from "@jest/globals";

const submitAddMock = jest.fn();
const submitRemoveMock = jest.fn();
let useAddFavoriteReturn: { submit: typeof submitAddMock; isAdded: boolean; isLoading: boolean };
let useRemoveFavoriteReturn: {
  submit: typeof submitRemoveMock;
  isRemoved: boolean;
  isLoading: boolean;
};
let useAuthReturn: { user: { id: number } | null };

jest.mock("../../hooks/use-add-favorite", () => ({
  useAddFavorite: () => useAddFavoriteReturn,
}));

jest.mock("../../hooks/use-remove-favorite", () => ({
  useRemoveFavorite: () => useRemoveFavoriteReturn,
}));

jest.mock("@shared/auth/AuthHooks.ts", () => ({
  useAuth: () => useAuthReturn,
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { FavoriteButtonContainer } from "../favorite-button-container";

describe("FavoriteButtonContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAddFavoriteReturn = { submit: submitAddMock, isAdded: false, isLoading: false };
    useRemoveFavoriteReturn = { submit: submitRemoveMock, isRemoved: false, isLoading: false };
    useAuthReturn = { user: { id: 1 } };
  });

  test("未ログインの場合は何も表示しない", () => {
    useAuthReturn = { user: null };

    const { container } = render(<FavoriteButtonContainer heritageId={42} />);

    expect(container).toBeEmptyDOMElement();
  });

  test("未登録状態でクリックするとaddのsubmitが呼ばれる", () => {
    render(<FavoriteButtonContainer heritageId={42} />);

    const button = screen.getByRole("button", { name: "Add to favorites" });
    fireEvent.click(button);

    expect(submitAddMock).toHaveBeenCalledWith(42);
    expect(submitRemoveMock).not.toHaveBeenCalled();
  });

  test("isAdded=trueの場合は登録済み表示になり、クリックするとremoveのsubmitが呼ばれる", () => {
    useAddFavoriteReturn = { submit: submitAddMock, isAdded: true, isLoading: false };

    render(<FavoriteButtonContainer heritageId={42} />);

    const button = screen.getByRole("button", { name: "Favorited" });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(submitRemoveMock).toHaveBeenCalledWith(42);
    expect(submitAddMock).not.toHaveBeenCalled();
  });

  test("isAdded=true かつ isRemoved=true の場合は未登録表示に戻る", () => {
    useAddFavoriteReturn = { submit: submitAddMock, isAdded: true, isLoading: false };
    useRemoveFavoriteReturn = { submit: submitRemoveMock, isRemoved: true, isLoading: false };

    render(<FavoriteButtonContainer heritageId={42} />);

    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeInTheDocument();
  });

  test("add処理中はボタンが無効化される", () => {
    useAddFavoriteReturn = { submit: submitAddMock, isAdded: false, isLoading: true };

    render(<FavoriteButtonContainer heritageId={42} />);

    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeDisabled();
  });

  test("remove処理中はボタンが無効化される", () => {
    useAddFavoriteReturn = { submit: submitAddMock, isAdded: true, isLoading: false };
    useRemoveFavoriteReturn = { submit: submitRemoveMock, isRemoved: false, isLoading: true };

    render(<FavoriteButtonContainer heritageId={42} />);

    expect(screen.getByRole("button", { name: "Favorited" })).toBeDisabled();
  });
});
