import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { jest } from "@jest/globals";

import { WorldHeritageDetailContainer } from "../world-heritage-detail-container";
import { useWorldHeritageDetail } from "../../hooks/use-world-heritage-detail";
import type { WorldHeritageVm } from "../../types";

jest.mock("../../hooks/use-world-heritage-detail");
jest.mock("../../components/heritage-detail/HeritageDetailLayout.tsx", () => ({
  HeritageDetailLayout: ({ item }: { item: WorldHeritageVm }) => (
    <div data-testid="heritage-detail-layout">Detail Layout: {item.title}</div>
  ),
}));

const useWorldHeritageDetailMock = useWorldHeritageDetail as jest.MockedFunction<
  (id: string | null) => {
    item: WorldHeritageVm | null;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    reload: () => void;
  }
>;

const renderWithRoute = (path: "/heritages" | "/heritages/:id", initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path={path} element={<WorldHeritageDetailContainer />} />
      </Routes>
    </MemoryRouter>,
  );

describe("WorldHeritageDetailContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("id が無い場合 'World Heritage id is required.' を表示する", () => {
    renderWithRoute("/heritages", "/heritages");

    expect(screen.getByText("World Heritage id is required.")).toBeInTheDocument();
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

  test("エラーの場合 メッセージと Retry ボタンを表示し、クリックで reload を呼ぶ", () => {
    const reload = jest.fn();
    const error = new Error("boom");

    useWorldHeritageDetailMock.mockReturnValue({
      item: null,
      isLoading: false,
      isError: true,
      error,
      reload,
    });

    renderWithRoute("/heritages/:id", "/heritages/1");

    expect(screen.getByText("Failed to load world heritage detail.")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(button);

    expect(reload).toHaveBeenCalledTimes(1);
  });

  test("成功時には HeritageDetailLayout を表示し、item を渡す", () => {
    const vm: WorldHeritageVm = {
      id: 1,
      officialName: "Official",
      name: "Ok",
      nameJp: "名前",
      country: "Japan",
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
      thumbnail: null,
      title: "Kyoto",
      subtitle: "Japan · Asia",
      areaText: "—",
      bufferText: "—",
      criteriaText: "",
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
});
