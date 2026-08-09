/** @jest-environment jsdom */

import { jest } from "@jest/globals";

const submitMock = jest.fn();
let useAddFavoriteReturn: { submit: typeof submitMock; isAdded: boolean; isLoading: boolean };
let useAuthReturn: { user: { id: number } | null };

jest.mock("../../hooks/use-add-favorite", () => ({
  useAddFavorite: () => useAddFavoriteReturn,
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
    useAddFavoriteReturn = { submit: submitMock, isAdded: false, isLoading: false };
    useAuthReturn = { user: { id: 1 } };
  });

  test("未ログインの場合は何も表示しない", () => {
    useAuthReturn = { user: null };

    const { container } = render(<FavoriteButtonContainer heritageId={42} />);

    expect(container).toBeEmptyDOMElement();
  });

  test("ログイン中はボタンが表示され、クリックでsubmitが呼ばれる", () => {
    render(<FavoriteButtonContainer heritageId={42} />);

    const button = screen.getByRole("button", { name: "Add to favorites" });
    fireEvent.click(button);

    expect(submitMock).toHaveBeenCalledWith(42);
  });

  test("isAdded=trueの場合は登録済み表示になり、ボタンは無効化される", () => {
    useAddFavoriteReturn = { submit: submitMock, isAdded: true, isLoading: false };

    render(<FavoriteButtonContainer heritageId={42} />);

    const button = screen.getByRole("button", { name: "Favorited" });
    expect(button).toBeDisabled();
  });

  test("isLoading=trueの場合はボタンが無効化される", () => {
    useAddFavoriteReturn = { submit: submitMock, isAdded: false, isLoading: true };

    render(<FavoriteButtonContainer heritageId={42} />);

    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeDisabled();
  });
});
