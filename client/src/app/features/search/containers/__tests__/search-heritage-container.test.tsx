/** @jest-environment jsdom */

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
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

const subHeaderSpy = jest.fn<void, [SubHeaderProps]>();

jest.mock("@features/top/components/HeritageSubHeader.tsx", () => ({
  HeritageSubHeader: (props: SubHeaderProps) => {
    subHeaderSpy(props);
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

const create = () => {
  let tr: TestRenderer.ReactTestRenderer;
  act(() => {
    tr = TestRenderer.create(<SearchHeritageFormContainer />);
  });
  // ts的に初期化保証

  return tr!;
};

describe("SearchHeritageFormContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigateMock.mockReturnValue(navigateMock);
    useLocationMock.mockReturnValue(loc("?region=AFR&search_query=Kyoto"));
  });

  test("location.search を parse に渡し、SubHeader に value を渡す", () => {
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

    create();

    expect(parseMock).toHaveBeenCalledTimes(1);
    expect(parseMock).toHaveBeenCalledWith("?region=AFR&search_query=Kyoto");

    expect(subHeaderSpy).toHaveBeenCalledTimes(1);
    const props = subHeaderSpy.mock.calls[0][0];
    expect(props.value).toEqual({ region: "AFR", category: "", keyword: "Kyoto" });
  });

  test("onSubmit で current_page を 1 にして serialize → navigate する", () => {
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

    create();

    const props = subHeaderSpy.mock.calls.at(-1)?.[0];
    if (!props) throw new Error("HeritageSubHeader was not rendered");

    act(() => {
      props.onSubmit({ region: "EUR", keyword: " Paris " });
    });

    expect(serializeMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  test("search が変わったら parse が呼ばれ直し、value が更新される", () => {
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

    const tr = create();

    expect(parseMock).toHaveBeenNthCalledWith(1, "?region=AFR&search_query=Kyoto");

    act(() => {
      tr.update(<SearchHeritageFormContainer />);
    });

    expect(parseMock).toHaveBeenNthCalledWith(
      2,
      "?region=EUR&category=Cultural&search_query=Paris",
    );
  });
});
