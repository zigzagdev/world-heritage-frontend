/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { CriteriaExampleCard } from "../CriteriaExampleCard";
import type { WorldHeritageVm } from "../../../../../../../domain/types.ts";

const buildVm = (overrides: Partial<WorldHeritageVm> = {}): WorldHeritageVm => ({
  id: 1,
  officialName: "Official",
  name: "Tanbaly",
  heritageNameJp: "タムガリ",
  country: "Kazakhstan",
  countryNameJp: "カザフスタン",
  region: "Asia",
  stateParty: "Kazakhstan",
  category: "Cultural",
  criteria: ["iii"],
  yearInscribed: 2004,
  areaHectares: null,
  bufferZoneHectares: null,
  isEndangered: false,
  latitude: null,
  longitude: null,
  shortDescription: "dummy",
  shortDescriptionJp: null,
  unescoSiteUrl: null,
  statePartyCodes: [],
  statePartiesMeta: {},
  primaryStatePartyCode: null,
  thumbnailUrl: null,
  title: "Tanbaly",
  subtitle: "Kazakhstan · Asia",
  displaySubName: null,
  displayDescription: "Petroglyphs of the Archaeological Landscape of Tanbaly.",
  areaText: "—",
  bufferText: "—",
  criteriaText: "(iii)",
  images: [],
  ...overrides,
});

const renderCard = (item: WorldHeritageVm, onClickItem = jest.fn()) =>
  render(
    <MemoryRouter>
      <LocaleProvider>
        <ul>
          <CriteriaExampleCard item={item} onClickItem={onClickItem} />
        </ul>
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("CriteriaExampleCard", () => {
  test("名称・説明・メタ情報・基準タグを表示する", () => {
    renderCard(buildVm());

    expect(screen.getByText("Tanbaly")).toBeInTheDocument();
    expect(
      screen.getByText("Petroglyphs of the Archaeological Landscape of Tanbaly."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Asia/)).toBeInTheDocument();
    expect(screen.getByText(/Kazakhstan/)).toBeInTheDocument();
    expect(screen.getByText(/Cultural/)).toBeInTheDocument();
    expect(screen.getByText(/2004/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /iii/ })).toBeInTheDocument();
  });

  test("詳細を見るボタンを押すと item.id で onClickItem が呼ばれる", () => {
    const onClickItem = jest.fn();
    renderCard(buildVm({ id: 42 }), onClickItem);

    fireEvent.click(screen.getByRole("button", { name: "View details" }));

    expect(onClickItem).toHaveBeenCalledWith(42);
  });
});
