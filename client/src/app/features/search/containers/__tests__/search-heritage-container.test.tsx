/** @jest-environment jsdom */

import { render, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import type { Location, NavigateFunction } from "react-router-dom";
import * as ReactRouterDOM from "react-router-dom";

import { SearchHeritageFormContainer } from "../search-heritage-form-container";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../../mapper/search-heritages.params";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom") as typeof import("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
  };
});

jest.mock("../../mapper/search-heritages.params", () => ({
  parseHeritageSearchParams: jest.fn(),
  serializeHeritageSearchParams: jest.fn(),
}));

type SubHeaderProps = {
  title?: string;
  value: {
    region: string;
    category: string;
    keyword: string;
    yearInscribedFrom: string;
    yearInscribedTo: string;
  };
  onChange: (v: {
    region: string;
    category: string;
    keyword: string;
    yearInscribedFrom: string;
    yearInscribedTo: string;
  }) => void;
  onSubmit: (q: {
    region?: string;
    category?: string;
    keyword?: string;
    yearInscribedFrom?: string;
    yearInscribedTo?: string;
  }) => void;
};

let lastSubHeaderProps: SubHeaderProps | null = null;

jest.mock("@features/top/components/HeritageSubHeader.tsx", () => ({
  HeritageSubHeader: (props: SubHeaderProps) => {
    lastSubHeaderProps = props;
    return null;
  },
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
    pathname: "/search",
    search,
    hash: "",
    state: null,
    key: "test",
  }) as Location;

let currentLocation: Location;

describe("SearchHeritageFormContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastSubHeaderProps = null;

    currentLocation = location("?region=AFR&search_query=Kyoto");

    useNavigateMock.mockReturnValue(navigateMock);
    useLocationMock.mockImplementation(() => currentLocation);
  });

  test("passes location.search to parse and passes form values to SubHeader", async () => {
    parseMock.mockReturnValue({
      search_query: "Kyoto",
      country: null,
      region: "AFR",
      category: null,
      year_inscribed_from: null,
      year_inscribed_to: null,
      order: "asc",
      current_page: 3,
      per_page: 30,
    });

    render(<SearchHeritageFormContainer />);

    expect(parseMock).toHaveBeenCalledWith("?region=AFR&search_query=Kyoto");

    await waitFor(() => {
      expect(lastSubHeaderProps).not.toBeNull();
      expect(lastSubHeaderProps!.value).toEqual({
        region: "AFR",
        category: "",
        keyword: "Kyoto",
        yearInscribedFrom: "",
        yearInscribedTo: "",
      });
    });
  });

  test("onSubmit sets current_page=1 then serialize -> navigate (with trimmed keyword)", async () => {
    parseMock.mockReturnValue({
      search_query: "Kyoto",
      country: null,
      region: "AFR",
      category: null,
      year_inscribed_from: null,
      year_inscribed_to: null,
      order: "asc",
      current_page: 5,
      per_page: 30,
    });

    serializeMock.mockReturnValue("?region=EUR&search_query=Paris&current_page=1");

    render(<SearchHeritageFormContainer />);

    await waitFor(() => expect(lastSubHeaderProps).not.toBeNull());

    act(() => {
      lastSubHeaderProps!.onSubmit({ region: "EUR", keyword: " Paris " });
    });

    expect(serializeMock).toHaveBeenCalledTimes(1);
    expect(serializeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        region: "EUR",
        category: null,
        search_query: "Paris",
        current_page: 1,
      }),
    );

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(
      { pathname: "/search", search: "?region=EUR&search_query=Paris&current_page=1" },
      { replace: false },
    );
  });

  test("re-parses when location.search changes and syncs draft with params", async () => {
    parseMock.mockImplementation((search: string) => {
      if (search === "?region=AFR&search_query=Kyoto") {
        return {
          search_query: "Kyoto",
          country: null,
          region: "AFR",
          category: null,
          year_inscribed_from: null,
          year_inscribed_to: null,
          order: "asc",
          current_page: 1,
          per_page: 30,
        };
      }

      if (search === "?region=EUR&category=Cultural&search_query=Paris") {
        return {
          search_query: "Paris",
          country: null,
          region: "EUR",
          category: "Cultural",
          year_inscribed_from: null,
          year_inscribed_to: null,
          order: "asc",
          current_page: 1,
          per_page: 30,
        };
      }

      throw new Error(`Unexpected search: ${search}`);
    });

    const { rerender } = render(<SearchHeritageFormContainer />);

    await waitFor(() => expect(lastSubHeaderProps).not.toBeNull());
    expect(lastSubHeaderProps!.value).toEqual({
      region: "AFR",
      category: "",
      keyword: "Kyoto",
      yearInscribedFrom: "",
      yearInscribedTo: "",
    });

    currentLocation = location("?region=EUR&category=Cultural&search_query=Paris");
    rerender(<SearchHeritageFormContainer />);

    await waitFor(() => {
      expect(lastSubHeaderProps).not.toBeNull();
      expect(lastSubHeaderProps!.value).toEqual({
        region: "EUR",
        category: "Cultural",
        keyword: "Paris",
        yearInscribedFrom: "",
        yearInscribedTo: "",
      });
    });
  });
});
