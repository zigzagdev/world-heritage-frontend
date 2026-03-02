/** @jest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { jest } from "@jest/globals";
import { WorldHeritageDetailContainer } from "../world-heritage-detail-container";
import { useWorldHeritageDetail } from "../../hooks/use-world-heritage-detail";
import type { WorldHeritageVm } from "../../../../../domain/types";
import { BreadcrumbProvider } from "@features/breadcrumbs/BreadCrumbProvider";

jest.mock("@features/breadcrumbs/BreadCrumbProvider", () => {
  type BreadcrumbMap = Record<string, string>;
  type BreadcrumbContextType = {
    labels: BreadcrumbMap;
    setLabel: (path: string, label: string) => void;
  };

  const BreadcrumbContext = React.createContext<BreadcrumbContextType | undefined>({
    labels: {},
    setLabel: () => {},
  });

  const MockBreadcrumbProvider = ({ children }: { children: React.ReactNode }) => (
    <BreadcrumbContext.Provider value={{ labels: {}, setLabel: () => {} }}>
      {children}
    </BreadcrumbContext.Provider>
  );

  return {
    __esModule: true,
    default: BreadcrumbContext,
    BreadcrumbProvider: MockBreadcrumbProvider,
  };
});

jest.mock("../../apis", () => ({
  fetchWorldHeritageDetail: jest.fn(),
}));

jest.mock("../../hooks/use-world-heritage-detail", () => ({
  useWorldHeritageDetail: jest.fn(),
}));

jest.mock("../../components/heritage-detail/HeritageDetailLayout.tsx", () => ({
  HeritageDetailLayout: ({ item }: { item: WorldHeritageVm }) => (
    <div data-testid="heritage-detail-layout">Detail Layout: {item.title}</div>
  ),
}));

type UseWorldHeritageDetailReturn = {
  item: WorldHeritageVm | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  reload: () => void;
};

const useWorldHeritageDetailMock = useWorldHeritageDetail as jest.MockedFunction<
  (id: string | null | undefined) => UseWorldHeritageDetailReturn
>;

const renderWithRoute = (path: "/heritages" | "/heritages/:id", initialEntry: string) =>
  render(
    <BreadcrumbProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path={path} element={<WorldHeritageDetailContainer />} />
        </Routes>
      </MemoryRouter>
    </BreadcrumbProvider>,
  );

describe("WorldHeritageDetailContainer", () => {
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

  test("loading の場合 'Loading…' を表示する", () => {
    useWorldHeritageDetailMock.mockReturnValue({
      item: null,
      isLoading: true,
      isError: false,
      error: null,
      reload: jest.fn(),
    });

    renderWithRoute("/heritages/:id", "/heritages/1");
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  test("エラーの場合 'Failed to load.' と Back ボタンを表示する", () => {
    useWorldHeritageDetailMock.mockReturnValue({
      item: null,
      isLoading: false,
      isError: true,
      error: new Error("boom"),
      reload: jest.fn(),
    });

    renderWithRoute("/heritages/:id", "/heritages/1");

    expect(screen.getByText("Failed to load.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to World Heritages" })).toBeInTheDocument();
  });

  test("item が null の場合 'Not found.' と Back ボタンを表示する", () => {
    useWorldHeritageDetailMock.mockReturnValue({
      item: null,
      isLoading: false,
      isError: false,
      error: null,
      reload: jest.fn(),
    });

    renderWithRoute("/heritages/:id", "/heritages/1");

    expect(screen.getByText("Not found.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to World Heritages" })).toBeInTheDocument();
  });

  test("成功時には HeritageDetailLayout を表示し、item を渡す", () => {
    const vm: WorldHeritageVm = {
      id: 1,
      officialName: "Official",
      name: "Ok",
      heritageNameJp: "名前",
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
      unescoSiteUrl: "https://example.com",
      statePartyCodes: [],
      statePartiesMeta: {},
      primaryStatePartyCode: null,
      thumbnailUrl: null,
      title: "Kyoto",
      subtitle: "Japan · Asia",
      areaText: "—",
      bufferText: "—",
      criteriaText: "",
      images: [],
    };

    useWorldHeritageDetailMock.mockReturnValue({
      item: vm,
      isLoading: false,
      isError: false,
      error: null,
      reload: jest.fn(),
    });

    renderWithRoute("/heritages/:id", "/heritages/1");

    const layout = screen.getByTestId("heritage-detail-layout");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveTextContent("Kyoto");
  });

  test("レンダリング時に hook を呼ぶ", () => {
    renderWithRoute("/heritages/:id", "/heritages/1");
    expect(useWorldHeritageDetailMock).toHaveBeenCalled();
  });
});
