/** @jest-environment jsdom */

import { render, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import type { Location, NavigateFunction } from "react-router-dom";
import * as ReactRouterDOM from "react-router-dom";

import TopPageContainer from "../../../top/containers/top-page-container";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "@features/search/mapper/search-heritages.params";
import type { HeritageSearchParams, IdSortOption } from "../../../../../domain/types";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom") as typeof import("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
  };
});

jest.mock("@features/search/mapper/search-heritages.params", () => ({
  parseHeritageSearchParams: jest.fn(),
  serializeHeritageSearchParams: jest.fn(),
}));

const useTopPageMock = jest.fn();

jest.mock("@features/top/hooks/use-top-page.ts", () => ({
  useTopPage: (args: { currentPage: number; perPage: number; order: IdSortOption }) =>
    useTopPageMock(args),
}));

type SearchValues = {
  region: string;
  category: string;
  keyword: string;
  yearInscribedFrom: string;
  yearInscribedTo: string;
  isEndangered: boolean;
};

type HeritageSubHeaderProps = {
  value: SearchValues;
  onChange: (v: SearchValues) => void;
  onSubmit: (q: Partial<SearchValues>) => void;
};

let lastSubHeaderProps: HeritageSubHeaderProps | null = null;

jest.mock("@features/top/components/HeritageSubHeader.tsx", () => ({
  HeritageSubHeader: (props: HeritageSubHeaderProps) => {
    lastSubHeaderProps = props;
    return null;
  },
}));

type TitleBarProps = {
  order: IdSortOption;
  onChangeOrder: (order: IdSortOption) => void;
  onReload?: () => void;
};

type PaginationProps = {
  currentPage: number;
  perPage: number;
  lastPage: number;
  onChangePage: (page: number) => void;
  onChangePerPage?: (perPage: number) => void;
  perPageOptions?: readonly number[];
  disabled?: boolean;
};

let lastTitleBarProps: TitleBarProps | null = null;
let lastPaginationProps: PaginationProps | null = null;

jest.mock("@features/top/components/TopPageTitleBar.tsx", () => ({
  TopPageTitleBar: (props: TitleBarProps) => {
    lastTitleBarProps = props;
    return null;
  },
}));

jest.mock("@features/top/components/TopPagePagination.tsx", () => ({
  TopPagePagination: (props: PaginationProps) => {
    lastPaginationProps = props;
    return null;
  },
}));

jest.mock("@features/top/components/HeritageList.tsx", () => ({
  HeritageList: () => null,
}));

jest.mock("@features/top/components/TopPage.tsx", () => ({
  __esModule: true,
  default: (props: {
    titleBar: React.ReactNode;
    header?: React.ReactNode;
    content: React.ReactNode;
    pagination?: React.ReactNode;
  }) => (
    <>
      {props.titleBar}
      {props.header}
      {props.content}
      {props.pagination}
    </>
  ),
}));

const parseMock = parseHeritageSearchParams as jest.MockedFunction<
  typeof parseHeritageSearchParams
>;
const serializeMock = serializeHeritageSearchParams as jest.MockedFunction<
  typeof serializeHeritageSearchParams
>;

const useNavigateMock = ReactRouterDOM.useNavigate as unknown as jest.MockedFunction<
  typeof ReactRouterDOM.useNavigate
>;
const useLocationMock = ReactRouterDOM.useLocation as unknown as jest.MockedFunction<
  typeof ReactRouterDOM.useLocation
>;

const navigateMock = jest.fn() as unknown as jest.MockedFunction<NavigateFunction>;

const location = (search: string): Location =>
  ({
    pathname: "/heritages",
    search,
    hash: "",
    state: null,
    key: "test",
  }) as Location;

let currentLocation: Location;

const makeParsedParams = (overrides: Partial<HeritageSearchParams> = {}): HeritageSearchParams => ({
  search_query: null,
  country: null,
  region: null,
  category: null,
  year_inscribed_from: null,
  year_inscribed_to: null,
  is_endangered: null,
  current_page: 1,
  per_page: 30,
  order: "asc",
  ...overrides,
});

describe("TopPageContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastSubHeaderProps = null;
    lastTitleBarProps = null;
    lastPaginationProps = null;

    currentLocation = location(
      "?region=Africa&search_query=Kyoto&current_page=3&per_page=30&order=asc",
    );

    useNavigateMock.mockReturnValue(navigateMock);
    useLocationMock.mockImplementation(() => currentLocation);

    useTopPageMock.mockReturnValue({
      items: [],
      pagination: {
        current_page: 3,
        per_page: 30,
        total: 100,
        last_page: 4,
      },
      reload: jest.fn(),
      isLoading: false,
      isError: false,
    });
  });

  test("passes location.search to parse and passes default draft values to SubHeader", async () => {
    parseMock.mockReturnValue(
      makeParsedParams({
        search_query: "Kyoto",
        region: "Africa",
        current_page: 3,
        per_page: 30,
        order: "asc",
      }),
    );

    render(<TopPageContainer />);

    expect(parseMock).toHaveBeenCalledWith(
      "?region=Africa&search_query=Kyoto&current_page=3&per_page=30&order=asc",
    );

    await waitFor(() => {
      expect(lastSubHeaderProps).not.toBeNull();
      expect(lastSubHeaderProps!.value).toEqual({
        region: "Africa",
        category: "",
        keyword: "Kyoto",
        yearInscribedFrom: "",
        yearInscribedTo: "",
        isEndangered: false,
      });
    });

    expect(useTopPageMock).toHaveBeenCalledWith({
      currentPage: 3,
      perPage: 30,
      order: "asc",
    });

    expect(lastPaginationProps).not.toBeNull();
    expect(lastPaginationProps!.currentPage).toBe(3);
    expect(lastPaginationProps!.perPage).toBe(30);
    expect(lastTitleBarProps!.order).toBe("asc");
  });

  test("onSubmit serialises merged search params and navigates to results", async () => {
    parseMock.mockReturnValue(
      makeParsedParams({
        current_page: 2,
        per_page: 30,
        order: "asc",
      }),
    );

    serializeMock.mockReturnValue(
      "?region=Europe&category=Cultural&search_query=Paris&year_inscribed_from=1990&current_page=1&per_page=30&order=asc",
    );

    render(<TopPageContainer />);

    await waitFor(() => expect(lastSubHeaderProps).not.toBeNull());

    act(() => {
      lastSubHeaderProps!.onSubmit({
        region: "Europe",
        category: "Cultural",
        keyword: " Paris ",
        yearInscribedFrom: "1990",
      });
    });

    expect(serializeMock).toHaveBeenCalledTimes(1);
    expect(serializeMock).toHaveBeenCalledWith({
      search_query: "Paris",
      country: null,
      region: "Europe",
      category: "Cultural",
      year_inscribed_from: 1990,
      year_inscribed_to: null,
      is_endangered: null,
      current_page: 1,
      per_page: 30,
      order: "asc",
    });

    expect(navigateMock).toHaveBeenCalledWith(
      {
        pathname: "/heritages/results",
        search:
          "?region=Europe&category=Cultural&search_query=Paris&year_inscribed_from=1990&current_page=1&per_page=30&order=asc",
      },
      { replace: false },
    );
  });

  test("onSubmit converts empty region to null", async () => {
    parseMock.mockReturnValue(
      makeParsedParams({
        current_page: 1,
        per_page: 30,
        order: "asc",
      }),
    );

    serializeMock.mockReturnValue("?current_page=1&per_page=30&order=asc");

    render(<TopPageContainer />);

    await waitFor(() => expect(lastSubHeaderProps).not.toBeNull());

    act(() => {
      lastSubHeaderProps!.onSubmit({
        region: "",
        keyword: "Kyoto",
      });
    });

    expect(serializeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        region: null,
        search_query: "Kyoto",
        current_page: 1,
      }),
    );
  });

  test("changes page with current perPage and order preserved", async () => {
    parseMock.mockReturnValue(
      makeParsedParams({
        current_page: 3,
        per_page: 30,
        order: "asc",
      }),
    );

    render(<TopPageContainer />);

    await waitFor(() => expect(lastPaginationProps).not.toBeNull());

    act(() => {
      lastPaginationProps!.onChangePage(4);
    });

    expect(navigateMock).toHaveBeenCalledWith(
      {
        pathname: "/heritages",
        search: "?region=Africa&search_query=Kyoto&current_page=4&per_page=30&order=asc",
      },
      { replace: false },
    );
  });

  test("changes perPage and resets current_page to 1", async () => {
    parseMock.mockReturnValue(
      makeParsedParams({
        current_page: 3,
        per_page: 30,
        order: "asc",
      }),
    );

    render(<TopPageContainer />);

    await waitFor(() => expect(lastPaginationProps).not.toBeNull());

    act(() => {
      lastPaginationProps!.onChangePerPage!(50);
    });

    expect(navigateMock).toHaveBeenCalledWith(
      {
        pathname: "/heritages",
        search: "?region=Africa&search_query=Kyoto&current_page=1&per_page=50&order=asc",
      },
      { replace: false },
    );
  });

  test("changes order and resets current_page to 1", async () => {
    parseMock.mockReturnValue(
      makeParsedParams({
        current_page: 3,
        per_page: 30,
        order: "asc",
      }),
    );

    render(<TopPageContainer />);

    await waitFor(() => expect(lastTitleBarProps).not.toBeNull());

    act(() => {
      lastTitleBarProps!.onChangeOrder("desc");
    });

    expect(navigateMock).toHaveBeenCalledWith(
      {
        pathname: "/heritages",
        search: "?region=Africa&search_query=Kyoto&current_page=1&per_page=30&order=desc",
      },
      { replace: false },
    );
  });
});
