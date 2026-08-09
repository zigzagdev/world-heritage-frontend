/** @jest-environment jsdom */

import "@testing-library/jest-dom/jest-globals";
import { describe, test, expect, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoriteHeartButton } from "../FavoriteHeartButton";

describe("FavoriteHeartButton", () => {
  test("未登録状態: 'Add to favorites'ラベルで表示され、クリックでonClickが呼ばれる", () => {
    const onClick = jest.fn();
    render(<FavoriteHeartButton isFavorited={false} onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Add to favorites" });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("登録済み状態: 'Favorited'ラベルで表示される", () => {
    render(<FavoriteHeartButton isFavorited={true} onClick={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Favorited" })).toBeInTheDocument();
  });

  test("isLoading=trueの場合はボタンが無効化される", () => {
    render(<FavoriteHeartButton isFavorited={false} isLoading={true} onClick={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeDisabled();
  });

  test("クリックイベントの伝播を止める(カードのクリックに巻き込まれない)", () => {
    const onClick = jest.fn();
    const onCardClick = jest.fn();

    render(
      <div onClick={onCardClick}>
        <FavoriteHeartButton isFavorited={false} onClick={onClick} />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).not.toHaveBeenCalled();
  });
});
