/** @jest-environment jsdom */

import "@testing-library/jest-dom/jest-globals";
import { jest } from "@jest/globals";
import type { ReactNode } from "react";
import type { WorldHeritageVm } from "../../../../../domain/types.ts";

jest.mock("@features/top/cards/HeritageCard", () => ({
  __esModule: true,
  HeritageCard: function MockHeritageCard(props: {
    item: WorldHeritageVm;
    onClickItem?: (id: number) => void;
    action?: ReactNode;
  }) {
    return (
      <div>
        <button type="button" onClick={() => props.onClickItem?.(props.item.id)}>
          {props.item.title}
        </button>
        {props.action}
      </div>
    );
  },
}));

jest.mock("../../containers/favorite-remove-button-container", () => ({
  __esModule: true,
  FavoriteRemoveButtonContainer: function MockFavoriteRemoveButtonContainer(props: {
    heritageId: number;
    onRemoved?: () => void;
  }) {
    return (
      <button type="button" onClick={() => props.onRemoved?.()}>
        remove-{props.heritageId}
      </button>
    );
  },
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { FavoriteList } from "../FavoriteList";

const renderList = (props: React.ComponentProps<typeof FavoriteList>) =>
  render(
    <MemoryRouter>
      <LocaleProvider>
        <FavoriteList {...props} />
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("FavoriteList", () => {
  it("0件の場合は空状態メッセージを表示する", () => {
    renderList({ items: [] });

    expect(screen.getByText("No favorites yet.")).toBeInTheDocument();
  });

  it("お気に入りをHeritageCardで描画し、クリックでonClickItemを呼ぶ", () => {
    const onClickItem = jest.fn();
    const items = [
      { id: 1, title: "Site A" },
      { id: 2, title: "Site B" },
    ] as unknown as WorldHeritageVm[];

    renderList({ items, onClickItem });

    fireEvent.click(screen.getByText("Site A"));
    expect(onClickItem).toHaveBeenCalledWith(1);
  });

  it("各カードにremoveボタンを配線し、クリックでonRemoveが呼ばれる", () => {
    const onRemove = jest.fn();
    const items = [{ id: 1, title: "Site A" }] as unknown as WorldHeritageVm[];

    renderList({ items, onRemove });

    fireEvent.click(screen.getByText("remove-1"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
