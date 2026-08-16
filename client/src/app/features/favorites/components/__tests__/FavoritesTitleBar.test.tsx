/** @jest-environment jsdom */

import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { FavoritesTitleBar } from "../FavoritesTitleBar";

describe("FavoritesTitleBar", () => {
  it("お気に入り一覧のタイトルを見出しとして表示する", () => {
    render(
      <MemoryRouter>
        <LocaleProvider>
          <FavoritesTitleBar />
        </LocaleProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Favorites List" })).toBeInTheDocument();
  });
});
