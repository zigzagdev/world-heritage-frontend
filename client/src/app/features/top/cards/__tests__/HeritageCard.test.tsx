/** @jest-environment jsdom */

import "@testing-library/jest-dom/jest-globals";
import { jest } from "@jest/globals";
import type { WorldHeritageVm } from "../../../../../domain/types.ts";

jest.mock("@features/favorites/containers/favorite-button-container.tsx", () => ({
  __esModule: true,
  FavoriteButtonContainer: function MockFavoriteButtonContainer(props: {
    heritageId: number;
    className?: string;
  }) {
    return <button type="button">favorite-button:{props.heritageId}</button>;
  },
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { HeritageCard } from "../HeritageCard";

const item = {
  id: 42,
  title: "Site A",
  thumbnailUrl: null,
  country: "Country",
  yearInscribed: 2000,
  isEndangered: false,
} as unknown as WorldHeritageVm;

const renderCard = (props: Partial<React.ComponentProps<typeof HeritageCard>> = {}) =>
  render(
    <MemoryRouter>
      <LocaleProvider>
        <HeritageCard item={item} {...props} />
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("HeritageCard", () => {
  it("action未指定時は既定のお気に入り追加ボタンを表示する", () => {
    renderCard();

    expect(screen.getByText("favorite-button:42")).toBeInTheDocument();
  });

  it("action={null}を渡すとアクション部分を表示しない", () => {
    renderCard({ action: null });

    expect(screen.queryByText("favorite-button:42")).not.toBeInTheDocument();
  });

  it("カスタムのactionを渡すとそれが表示される", () => {
    renderCard({ action: <span>custom-action</span> });

    expect(screen.getByText("custom-action")).toBeInTheDocument();
    expect(screen.queryByText("favorite-button:42")).not.toBeInTheDocument();
  });

  it("カードクリックでonClickItemがitem.idを引数に呼ばれる", () => {
    const onClickItem = jest.fn();
    renderCard({ onClickItem });

    fireEvent.click(screen.getByRole("button", { name: /Site A/ }));

    expect(onClickItem).toHaveBeenCalledWith(42);
  });

  it("isEndangered=trueの場合はDANGERバッジが表示される", () => {
    renderCard({ item: { ...item, isEndangered: true } as unknown as WorldHeritageVm });

    expect(screen.getByText("DANGER")).toBeInTheDocument();
  });
});
