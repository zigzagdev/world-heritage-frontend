/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { CriteriaDetailPage } from "../CriteriaDetailPage";
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

const renderPage = (items: WorldHeritageVm[], onViewAllResults = jest.fn()) =>
  render(
    <MemoryRouter>
      <LocaleProvider>
        <CriteriaDetailPage
          code="iii"
          title="文明の証拠"
          description="現存する、または消滅した文化的伝統や文明の独自または稀有な証拠であること。"
          sourceUrl="https://whc.unesco.org/en/criteria/#iii"
          items={items}
          onClickItem={jest.fn()}
          onViewAllResults={onViewAllResults}
        />
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("CriteriaDetailPage", () => {
  test("基準コード・タイトル・説明・UNESCO公式リンクを表示する", () => {
    renderPage([buildVm()]);

    expect(screen.getByText("Criteria (iii)")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "文明の証拠" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "現存する、または消滅した文化的伝統や文明の独自または稀有な証拠であること。",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "UNESCO official criteria page" })).toHaveAttribute(
      "href",
      "https://whc.unesco.org/en/criteria/#iii",
    );
  });

  test("実例がある場合は遺産カードを表示する", () => {
    renderPage([buildVm({ id: 1, title: "Tanbaly" }), buildVm({ id: 2, title: "Other Site" })]);

    expect(screen.getByText("Tanbaly")).toBeInTheDocument();
    expect(screen.getByText("Other Site")).toBeInTheDocument();
  });

  test("実例が0件の場合は該当なしメッセージを表示する", () => {
    renderPage([]);

    expect(screen.getByText("No sites found.")).toBeInTheDocument();
  });

  test("「すべての結果を見る」ボタンを押すと onViewAllResults が呼ばれる", () => {
    const onViewAllResults = jest.fn();
    renderPage([buildVm()], onViewAllResults);

    fireEvent.click(screen.getByRole("button", { name: "View all results" }));

    expect(onViewAllResults).toHaveBeenCalledTimes(1);
  });
});
