/** @jest-environment jsdom */

import "@testing-library/jest-dom/jest-globals";
import { jest } from "@jest/globals";

const submitMock = jest.fn();
let useRemoveFavoriteReturn: {
  submit: typeof submitMock;
  isRemoved: boolean;
  isLoading: boolean;
};

jest.mock("../../hooks/use-remove-favorite", () => ({
  useRemoveFavorite: () => useRemoveFavoriteReturn,
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { FavoriteRemoveButtonContainer } from "../favorite-remove-button-container";

describe("FavoriteRemoveButtonContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRemoveFavoriteReturn = { submit: submitMock, isRemoved: false, isLoading: false };
  });

  test("常に登録済み表示で、クリックするとsubmitが呼ばれる", () => {
    render(<FavoriteRemoveButtonContainer heritageId={42} />);

    const button = screen.getByRole("button", { name: "Favorited" });
    fireEvent.click(button);

    expect(submitMock).toHaveBeenCalledWith(42);
  });

  test("isLoading=trueの場合はボタンが無効化される", () => {
    useRemoveFavoriteReturn = { submit: submitMock, isRemoved: false, isLoading: true };

    render(<FavoriteRemoveButtonContainer heritageId={42} />);

    expect(screen.getByRole("button", { name: "Favorited" })).toBeDisabled();
  });

  test("isRemoved=trueの場合は未登録表示になる", () => {
    useRemoveFavoriteReturn = { submit: submitMock, isRemoved: true, isLoading: false };

    render(<FavoriteRemoveButtonContainer heritageId={42} />);

    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeInTheDocument();
  });

  test("isRemoved=trueになった時点でonRemovedが呼ばれる", () => {
    const onRemoved = jest.fn();
    const { rerender } = render(
      <FavoriteRemoveButtonContainer heritageId={42} onRemoved={onRemoved} />,
    );
    expect(onRemoved).not.toHaveBeenCalled();

    useRemoveFavoriteReturn = { submit: submitMock, isRemoved: true, isLoading: false };
    rerender(<FavoriteRemoveButtonContainer heritageId={42} onRemoved={onRemoved} />);

    expect(onRemoved).toHaveBeenCalledTimes(1);
  });
});
