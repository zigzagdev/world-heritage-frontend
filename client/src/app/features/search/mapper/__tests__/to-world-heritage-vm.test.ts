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

const makeWorldHeritageDto = (
  overrides: Partial<ApiWorldHeritageDto> = {},
): ApiWorldHeritageDto => {
  const base = {
    id: 1,
    official_name: "Official Name",
    name: "Name",
    name_jp: "名称",
    country: "Japan",
    region: "Asia",
    state_party: null,
    category: "cultural" as Category,
    criteria: ["i", "iv"] as CriteriaCode[],
    year_inscribed: 1993,
    area_hectares: 1234,
    buffer_zone_hectares: null,
    is_endangered: false,
    latitude: 35.0,
    longitude: 139.0,
    short_description: "short",
    unesco_site_url: "https://example.com",
    state_party_codes: ["JP"],
    state_parties_meta: {},
    primary_state_party_code: "JP",
    image_url: null,
    images: [],
  } satisfies ApiWorldHeritageDto;

  return { ...base, ...overrides };
};

const dto1 = makeWorldHeritageDto({ id: 1 });
const dto2 = makeWorldHeritageDto({ id: 2, name: "Another" });

const makeResponse = (overrides: Partial<HeritageSearchResponse> = {}): HeritageSearchResponse => {
  const base: HeritageSearchResponse = {
    status: "success",
    data: {
      data: [dto1],
      pagination: {
        current_page: 1,
        per_page: 30,
        total: 0,
        last_page: 1,
      },
    },
  };

  return { ...base, ...overrides };
};

// typed mock helper（any不要）
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

    const res = makeResponse({
      data: {
        data: [dto1, dto2],
        pagination: {
          current_page: 2,
          per_page: 30,
          total: 100,
          last_page: 4,
        },
      },
    });

    const vm = toHeritageSearchResultVm(res);

    expect(mockedToWorldHeritageListVm).toHaveBeenCalledTimes(1);
    expect(mockedToWorldHeritageListVm).toHaveBeenCalledWith(res.data.data);

    expect(vm.items).toBe(mappedItems);
    expect(vm.pagination).toEqual(res.data.pagination);
  });

  it("sets isFirstPage true when current_page <= 1", () => {
    mockedToWorldHeritageListVm.mockReturnValue([]);

    const res = makeResponse({
      data: {
        data: [dto1, dto2],
        pagination: {
          current_page: 1,
          per_page: 30,
          total: 10,
          last_page: 1,
        },
      },
    });

    const vm = toHeritageSearchResultVm(res);

    expect(vm.isFirstPage).toBe(true);
    expect(vm.isLastPage).toBe(true);
  });

  it("sets isLastPage true when current_page >= last_page", () => {
    mockedToWorldHeritageListVm.mockReturnValue([]);

    const res = makeResponse({
      data: {
        data: [dto1, dto2],
        pagination: {
          current_page: 3,
          per_page: 30,
          total: 90,
          last_page: 3,
        },
      },
    });

    const vm = toHeritageSearchResultVm(res);

    expect(vm.isLastPage).toBe(true);
    expect(vm.isFirstPage).toBe(false);
  });

  it("builds rangeText correctly for non-empty result", () => {
    // page2, per_page30, count30 => 31–60
    const mappedItems: WorldHeritageVm[] = new Array(30)
      .fill(null)
      .map((_, i) => ({ id: i + 1 }) as unknown as WorldHeritageVm);

    mockedToWorldHeritageListVm.mockReturnValue(mappedItems);

    const res = makeResponse({
      data: {
        data: [dto1, dto2], // mapperはmockなので中身の件数は関係ない
        pagination: {
          current_page: 2,
          per_page: 30,
          total: 2345,
          last_page: 79,
        },
      },
    });

    const vm = toHeritageSearchResultVm(res);

    expect(vm.rangeText).toBe("31–60 of 2,345");
  });

  it("builds rangeText correctly for empty result", () => {
    mockedToWorldHeritageListVm.mockReturnValue([]);

    const res = makeResponse({
      data: {
        data: [dto1, dto2],
        pagination: {
          current_page: 5,
          per_page: 30,
          total: 2345,
          last_page: 79,
        },
      },
    });

    const vm = toHeritageSearchResultVm(res);

    expect(vm.rangeText).toBe("0 of 2,345");
  });
});
