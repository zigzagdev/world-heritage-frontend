/** @jest-environment jsdom */

import React from "react";
import { render, act } from "@testing-library/react";
import { jest } from "@jest/globals";
import * as rrd from "react-router-dom";
import type { Location } from "react-router-dom";

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

const parseMock = parseHeritageSearchParams as jest.MockedFunction<
  typeof parseHeritageSearchParams
>;
const serializeMock = serializeHeritageSearchParams as jest.MockedFunction<
  typeof serializeHeritageSearchParams
>;

type SubHeaderProps = {
  title: string;
  value: { region: string; category: string; keyword: string };
  onSubmit: (q: { region?: string; category?: string; keyword?: string }) => void;
};

let lastSubHeaderProps: SubHeaderProps | null = null;

jest.mock("@features/top/components/HeritageSubHeader.tsx", () => ({
  HeritageSubHeader: (props: SubHeaderProps) => {
    lastSubHeaderProps = props;
    return null;
  },
}));

const navigateMock = jest.fn();

const useNavigateMock = rrd.useNavigate as unknown as jest.MockedFunction<typeof rrd.useNavigate>;
const useLocationMock = rrd.useLocation as unknown as jest.MockedFunction<typeof rrd.useLocation>;

const loc = (search: string): Location => ({
  pathname: "/search",
  search,
  hash: "",
  state: null,
  key: "test",
});

describe("SearchHeritageFormContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastSubHeaderProps = null;

    useNavigateMock.mockReturnValue(navigateMock);
    useLocationMock.mockReturnValue(loc("?region=AFR&search_query=Kyoto"));
  });

  test("passes location.search to parse and passes value to SubHeader", () => {
    parseMock.mockReturnValue({
      search_query: "Kyoto",
      country: null,
      region: "AFR",
      category: null,
      year_inscribed_from: null,
      year_inscribed_to: null,
      current_page: 3,
      per_page: 30,
    });

    render(<SearchHeritageFormContainer />);

    expect(parseMock).toHaveBeenCalledTimes(1);
    expect(parseMock).toHaveBeenCalledWith("?region=AFR&search_query=Kyoto");

    expect(lastSubHeaderProps).not.toBeNull();
    expect(lastSubHeaderProps!.value).toEqual({ region: "AFR", category: "", keyword: "Kyoto" });
  });

  test("onSubmit sets current_page=1 then serialize -> navigate (with trimmed keyword)", () => {
    parseMock.mockReturnValue({
      search_query: "Kyoto",
      country: null,
      region: "AFR",
      category: null,
      year_inscribed_from: null,
      year_inscribed_to: null,
      current_page: 5,
      per_page: 30,
    });

    serializeMock.mockReturnValue("?region=EUR&search_query=Paris&current_page=1");

    render(<SearchHeritageFormContainer />);

    expect(lastSubHeaderProps).not.toBeNull();

    act(() => {
      lastSubHeaderProps!.onSubmit({ region: "EUR", keyword: " Paris " });
    });

    // next params が serialize に渡ったこと（current_page=1 & trim 済み）
    expect(serializeMock).toHaveBeenCalledTimes(1);
    expect(serializeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        region: "EUR",
        search_query: "Paris",
        current_page: 1,
      }),
    );

    // navigate の引数まで固定（ここを曖昧にすると壊れても検知できない）
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(
      { pathname: "/search", search: "?region=EUR&search_query=Paris&current_page=1" },
      { replace: false },
    );
  });

  test("re-parses when location.search changes", () => {
    useLocationMock
      .mockReturnValueOnce(loc("?region=AFR&search_query=Kyoto"))
      .mockReturnValueOnce(loc("?region=EUR&category=Cultural&search_query=Paris"));

    parseMock
      .mockReturnValueOnce({
        search_query: "Kyoto",
        country: null,
        region: "AFR",
        category: null,
        year_inscribed_from: null,
        year_inscribed_to: null,
        current_page: 1,
        per_page: 30,
      })
      .mockReturnValueOnce({
        search_query: "Paris",
        country: null,
        region: "EUR",
        category: "Cultural",
        year_inscribed_from: null,
        year_inscribed_to: null,
        current_page: 1,
        per_page: 30,
      });

    const { rerender } = render(<SearchHeritageFormContainer />);

    expect(parseMock).toHaveBeenNthCalledWith(1, "?region=AFR&search_query=Kyoto");

    act(() => {
      rerender(<SearchHeritageFormContainer />);
    });

    expect(parseMock).toHaveBeenNthCalledWith(
      2,
      "?region=EUR&category=Cultural&search_query=Paris",
    );
    expect(lastSubHeaderProps).not.toBeNull();
    expect(lastSubHeaderProps!.value).toEqual({
      region: "EUR",
      category: "Cultural",
      keyword: "Paris",
    });
  });
});
