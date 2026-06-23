/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { WorldHeritageBasics } from "../WorldHeritageBasics";
import { CRITERIA_CODES } from "../../../../../domain/criteria";

const renderBasics = () =>
  render(
    <MemoryRouter>
      <LocaleProvider>
        <WorldHeritageBasics />
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("WorldHeritageBasics", () => {
  test("見出しと説明文を表示する", () => {
    renderBasics();

    expect(screen.getByRole("heading", { name: "World Heritage Basics" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Every site is inscribed under one or more of these 10 selection criteria. Explore what each one means.",
      ),
    ).toBeInTheDocument();
  });

  test("10個の登録基準すべてに /heritages/criteria/:code へのリンクを表示する", () => {
    renderBasics();

    CRITERIA_CODES.forEach((code) => {
      const link = screen.getByRole("link", { name: new RegExp(`^\\(${code}\\)`) });
      expect(link).toHaveAttribute("href", `/heritages/criteria/${code}`);
    });
  });
});
