/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CriteriaDetailContainer } from "../criteria-detail-container";
import { useHeritageSearchQuery } from "@features/search/hooks/use-search-heritage-query";
import type { ApiWorldHeritageDto, ListResult } from "../../../../../domain/types";

jest.mock("@shared/locale/LocaleHooks", () => ({
  __esModule: true,
  useLocale: () => ({ locale: "en", setLocale: jest.fn(), toggleLocale: jest.fn() }),
}));

jest.mock("@features/search/hooks/use-search-heritage-query", () => ({
  useHeritageSearchQuery: jest.fn(),
}));

jest.mock("../../components/heritage-detail/criteria/CriteriaDetailPage", () => ({
  CriteriaDetailPage: ({ code, title }: { code: string; title: string }) => (
    <div data-testid="criteria-detail-page">
      Criteria page: {code} / {title}
    </div>
  ),
}));

const useHeritageSearchQueryMock = useHeritageSearchQuery as jest.MockedFunction<
  typeof useHeritageSearchQuery
>;

type UseHeritageSearchQueryReturn = {
  data: ListResult<ApiWorldHeritageDto> | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
};

const mockReturn = (overrides: Partial<UseHeritageSearchQueryReturn> = {}) =>
  useHeritageSearchQueryMock.mockReturnValue({
    data: null,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  } as ReturnType<typeof useHeritageSearchQuery>);

const renderWithRoute = (initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/heritages" element={<div>Index Page</div>} />
        <Route path="/heritages/criteria/:code" element={<CriteriaDetailContainer />} />
      </Routes>
    </MemoryRouter>,
  );

describe("CriteriaDetailContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReturn();
  });

  test("不正な基準コードの場合は一覧ページへリダイレクトする", async () => {
    renderWithRoute("/heritages/criteria/zzz");

    expect(await screen.findByText("Index Page")).toBeInTheDocument();
  });

  test("読み込み中は Spinner を表示する", () => {
    mockReturn({ isLoading: true });

    renderWithRoute("/heritages/criteria/iii");

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  test("エラー時は ErrorPanel を表示する", () => {
    mockReturn({ error: new Error("boom") });

    renderWithRoute("/heritages/criteria/iii");

    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  test("成功時には criteria を渡して検索フックを呼び、CriteriaDetailPage を表示する", () => {
    mockReturn({ data: { items: [], pagination: {} as never } });

    renderWithRoute("/heritages/criteria/iii");

    expect(screen.getByTestId("criteria-detail-page")).toHaveTextContent("Criteria page: iii");
    expect(useHeritageSearchQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({ criteria: ["iii"], per_page: 6 }),
      expect.objectContaining({ enabled: true }),
    );
  });
});
