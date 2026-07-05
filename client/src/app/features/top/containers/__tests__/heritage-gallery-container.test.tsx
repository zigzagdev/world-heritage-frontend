/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HeritageGalleryContainer } from "../heritage-gallery-container";
import { useWorldHeritageDetail } from "../../hooks/use-world-heritage-detail";
import type { WorldHeritageVm } from "../../../../../domain/types";

jest.mock("../../hooks/use-world-heritage-detail", () => ({
  useWorldHeritageDetail: jest.fn(),
}));

const useWorldHeritageDetailMock = useWorldHeritageDetail as jest.MockedFunction<
  (id: string | null | undefined) => {
    item: WorldHeritageVm | null;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    reload: () => void;
  }
>;

const buildVm = (overrides: Partial<WorldHeritageVm> = {}): WorldHeritageVm => ({
  id: 1,
  officialName: "Official",
  name: "Kyoto",
  heritageNameJp: "京都",
  country: "Japan",
  countryNameJp: "日本",
  region: "Asia",
  stateParty: "Japan",
  category: "Cultural",
  criteria: [],
  yearInscribed: 2000,
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
  title: "Kyoto",
  subtitle: "Japan · Asia",
  displaySubName: null,
  displayDescription: "dummy",
  areaText: "—",
  bufferText: "—",
  criteriaText: "",
  images: [
    {
      id: 1,
      url: "https://example.com/1.jpg",
      alt: "Photo 1",
      credit: null,
      width: 800,
      height: 600,
      isPrimary: true,
    },
    {
      id: 2,
      url: "https://example.com/2.jpg",
      alt: "Photo 2",
      credit: null,
      width: 800,
      height: 600,
      isPrimary: false,
    },
  ],
  ...overrides,
});

const renderWithRoute = (initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/heritages" element={<div>Index Page</div>} />
        <Route path="/heritages/:id" element={<div>Detail Page</div>} />
        <Route path="/heritages/:id/gallery" element={<HeritageGalleryContainer />} />
      </Routes>
    </MemoryRouter>,
  );

describe("HeritageGalleryContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useWorldHeritageDetailMock.mockReturnValue({
      item: null,
      isLoading: false,
      isError: false,
      error: null,
      reload: jest.fn(),
    });
  });

  test("読み込み中は Spinner を表示する", () => {
    useWorldHeritageDetailMock.mockReturnValue({
      item: null,
      isLoading: true,
      isError: false,
      error: null,
      reload: jest.fn(),
    });

    renderWithRoute("/heritages/1/gallery");
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  test("エラー時は ErrorPanel を表示する", () => {
    useWorldHeritageDetailMock.mockReturnValue({
      item: null,
      isLoading: false,
      isError: true,
      error: new Error("boom"),
      reload: jest.fn(),
    });

    renderWithRoute("/heritages/1/gallery");
    expect(screen.getByText("Failed to load this site.")).toBeInTheDocument();
  });

  test("成功時には全件の画像を表示する", () => {
    useWorldHeritageDetailMock.mockReturnValue({
      item: buildVm(),
      isLoading: false,
      isError: false,
      error: null,
      reload: jest.fn(),
    });

    renderWithRoute("/heritages/1/gallery");

    expect(screen.getByText("2 photos")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Open photo/ })).toHaveLength(2);
  });

  test("戻るボタンを押すと遺産詳細ページへ遷移する", () => {
    useWorldHeritageDetailMock.mockReturnValue({
      item: buildVm(),
      isLoading: false,
      isError: false,
      error: null,
      reload: jest.fn(),
    });

    renderWithRoute("/heritages/1/gallery");

    fireEvent.click(screen.getByRole("button", { name: /Kyoto/ }));
    expect(screen.getByText("Detail Page")).toBeInTheDocument();
  });
});
