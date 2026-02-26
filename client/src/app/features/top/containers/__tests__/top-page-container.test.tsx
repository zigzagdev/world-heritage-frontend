import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { WorldHeritageVm } from "../../../../../domain/types.ts";

const navigateMock = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

jest.mock("../../hooks/use-top-page", () => ({
  useTopPage: jest.fn(),
}));

jest.mock("../../components/HeritageSubHeader", () => ({
  __esModule: true,
  HeritageSubHeader: function MockHeritageSubHeader() {
    return <div data-testid="subheader" />;
  },
}));

jest.mock("../../components/TopPage", () => ({
  __esModule: true,
  default: function MockTopPage(props: {
    header: React.ReactNode;
    items: ReadonlyArray<WorldHeritageVm>;
    onClickItem: (id: number) => void;
    onReload: () => void;
    currentPage: number;
    lastPage: number;
    onChangePage: (p: number) => void;
    paginationDisabled?: boolean;
  }) {
    return (
      <div>
        <div data-testid="header">{props.header}</div>
        <ul>
          {props.items.map((it) => (
            <li key={it.id}>
              <button type="button" onClick={() => props.onClickItem(it.id)}>
                {it.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  },
}));

import TopPageContainer from "../top-page-container";
import { useTopPage } from "../../hooks/use-top-page";

type UseTopPageResult = ReturnType<typeof useTopPage>;
const useTopPageMock = useTopPage as jest.MockedFunction<typeof useTopPage>;

const HIMEJI_VM = { id: 661, title: "Himeji-jo" } as WorldHeritageVm;
const YAKUSHIMA_VM = { id: 662, title: "Yakushima" } as WorldHeritageVm;

const mkHookState = (overrides: Partial<UseTopPageResult> = {}): UseTopPageResult => {
  const base: UseTopPageResult = {
    items: [],
    rawItems: [],

    pagination: { current_page: 1, per_page: 50, total: 0, last_page: 1 },
    page: 1,
    setPage: jest.fn(),

    reload: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,

    filters: { category: null, region: null },
    setCategory: jest.fn(),
    setRegion: jest.fn(),
    clearFilters: jest.fn(),
    hasActiveFilters: false,
    categoryOptions: [],
    regionOptions: [],

    sort: "default",
    setSort: jest.fn(),
  };

  return { ...base, ...overrides };
};

const makeOk = (items: ApiWorldHeritageDto[]) => ({
  items,
  pagination: {
    current_page: 1,
    per_page: 50,
    total: items.length,
    last_page: 1,
  },
});

describe("TopPageContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    navigateMock.mockReset();
  });

  it("loading のときは Loading… を表示する", () => {
    useTopPageMock.mockReturnValue(
      mkHookState({
        isLoading: true,
        items: [],
      }),
    );

    render(
      <MemoryRouter>
        <TopPageContainer />
      </MemoryRouter>,
    );
    
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.getByTestId("subheader")).toBeInTheDocument();
  });

  it("error のとき Failed to load を表示し、Retry で reload が呼ばれる", () => {
    const reloadMock = jest.fn();

    useTopPageMock.mockReturnValue(
      mkHookState({
        isLoading: false,
        isError: true,
        error: new Error("boom"),
        reload: reloadMock,
      }),
    );

    render(
      <MemoryRouter>
        <TopPageContainer />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Retry/i));
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it("一覧が描画され、item click で navigate される", () => {
    useTopPageMock.mockReturnValue(
      mkHookState({
        isLoading: false,
        isError: false,
        items: [HIMEJI_VM, YAKUSHIMA_VM],
        rawItems: [HIMEJI_VM, YAKUSHIMA_VM],
        pagination: { current_page: 1, per_page: 50, total: 2, last_page: 1 },
      }),
    );

    render(
      <MemoryRouter>
        <TopPageContainer />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Himeji-jo" }));
    expect(navigateMock).toHaveBeenCalledWith("/heritages/661");
  });
});
