/** @jest-environment jsdom */

import type {
  ApiWorldHeritageDto,
  Category,
  CriteriaCode,
  WorldHeritageVm,
} from "../../../../../domain/types.ts";
import type { HeritageSearchResponse } from "../../types.ts";
import { toHeritageSearchResultVm } from "../to-search-heritage-vm.ts";

jest.mock("../../../heritages/mappers/to-world-heritage-vm.ts", () => ({
  toWorldHeritageListVm: jest.fn(),
}));

import { toWorldHeritageListVm } from "../../../heritages/mappers/to-world-heritage-vm.ts";

type SuccessResponse = Extract<HeritageSearchResponse, { status: "success" }>;

const makeWorldHeritageDto = (
  overrides: Partial<ApiWorldHeritageDto> = {},
): ApiWorldHeritageDto => {
  const base = {
    id: 1,
    official_name: "Official Name",
    name: "Name",
    heritage_name_jp: "名称",
    country: "Japan",
    country_name_jp: "日本",
    region: "Asia",
    category: "Cultural" as Category,
    year_inscribed: 1993,
    latitude: 35.0,
    longitude: 139.0,
    is_endangered: false,
    criteria: ["i", "iv"] as CriteriaCode[],
    area_hectares: 1234,
    buffer_zone_hectares: null,
    short_description: "short",
    unesco_site_url: "https://example.com",
    state_party: null,
    state_party_codes: ["JP"],
    state_parties_meta: {},
    thumbnail: null,
  } satisfies ApiWorldHeritageDto;

  return { ...base, ...overrides };
};

const dto1 = makeWorldHeritageDto({ id: 1 });
const dto2 = makeWorldHeritageDto({ id: 2, name: "Another" });

const makeSuccessResponse = (overrides: Partial<SuccessResponse> = {}): SuccessResponse => {
  const base: SuccessResponse = {
    status: "success",
    data: {
      items: [dto1],
      pagination: {
        current_page: 1,
        per_page: 30,
        total: 0,
        last_page: 1,
      },
    },
  };

  return {
    ...base,
    ...overrides,
    data: {
      ...base.data,
      ...(overrides.data ?? {}),
    },
  };
};

const mockedToWorldHeritageListVm = toWorldHeritageListVm as jest.MockedFunction<
  typeof toWorldHeritageListVm
>;

describe("toHeritageSearchResultVm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps items using toWorldHeritageListVm and returns pagination as-is", () => {
    const mappedItems: WorldHeritageVm[] = [
      { id: 1 } as unknown as WorldHeritageVm,
      { id: 2 } as unknown as WorldHeritageVm,
    ];
    mockedToWorldHeritageListVm.mockReturnValue(mappedItems);

    const response = makeSuccessResponse({
      data: {
        items: [dto1, dto2],
        pagination: { current_page: 2, per_page: 30, total: 100, last_page: 4 },
      },
    });

    const viewModel = toHeritageSearchResultVm(response);

    expect(mockedToWorldHeritageListVm).toHaveBeenCalledTimes(1);
    expect(mockedToWorldHeritageListVm).toHaveBeenCalledWith(response.data.items);

    expect(viewModel.items).toBe(mappedItems);
    expect(viewModel.pagination).toEqual(response.data.pagination);
  });

  it("sets isFirstPage true when current_page <= 1", () => {
    mockedToWorldHeritageListVm.mockReturnValue([]);

    const response = makeSuccessResponse({
      data: {
        items: [dto1, dto2],
        pagination: { current_page: 1, per_page: 30, total: 10, last_page: 1 },
      },
    });

    const viewModel = toHeritageSearchResultVm(response);

    expect(viewModel.isFirstPage).toBe(true);
    expect(viewModel.isLastPage).toBe(true);
  });

  it("sets isLastPage true when current_page >= last_page", () => {
    mockedToWorldHeritageListVm.mockReturnValue([]);

    const response = makeSuccessResponse({
      data: {
        items: [dto1, dto2],
        pagination: { current_page: 3, per_page: 30, total: 90, last_page: 3 },
      },
    });

    const viewModel = toHeritageSearchResultVm(response);

    expect(viewModel.isLastPage).toBe(true);
    expect(viewModel.isFirstPage).toBe(false);
  });

  it("builds rangeText correctly for non-empty result", () => {
    const mappedItems: WorldHeritageVm[] = new Array(30)
      .fill(null)
      .map((_, i) => ({ id: i + 1 }) as unknown as WorldHeritageVm);

    mockedToWorldHeritageListVm.mockReturnValue(mappedItems);

    const response = makeSuccessResponse({
      data: {
        items: [dto1, dto2],
        pagination: { current_page: 2, per_page: 30, total: 2345, last_page: 79 },
      },
    });

    const viewModel = toHeritageSearchResultVm(response);

    expect(viewModel.rangeText).toBe("31–60 of 2,345");
  });

  it("builds rangeText correctly for empty result", () => {
    mockedToWorldHeritageListVm.mockReturnValue([]);

    const response = makeSuccessResponse({
      data: {
        items: [],
        pagination: { current_page: 5, per_page: 30, total: 2345, last_page: 79 },
      },
    });

    const viewModel = toHeritageSearchResultVm(response);

    expect(viewModel.rangeText).toBe("0 of 2,345");
  });
});
