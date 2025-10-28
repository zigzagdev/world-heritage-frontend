import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import type { ApiWorldHeritageDto, WorldHeritageVm } from "../types";

type FetchFn = (init?: unknown) => Promise<ApiWorldHeritageDto[]>;
type MapFn = (list: ApiWorldHeritageDto[]) => WorldHeritageVm[];

const mockFetch = jest.fn() as jest.MockedFunction<FetchFn>;
const mockMap = jest.fn() as jest.MockedFunction<MapFn>;

await jest.unstable_mockModule("../apis/index.ts", () => ({
  fetchTopFirstPage: mockFetch,
}));
await jest.unstable_mockModule("../mappers/to-world-heritage-vm.js", () => ({
  toWorldHeritageListVm: mockMap,
}));

const { useTopPage } = await import("./use-top-page.js");

describe("useTopPage", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockMap.mockReset();
  });

  it("初回マウントでデータをロードして items に反映（ハッピーパス）", async () => {
    const dtoList: ApiWorldHeritageDto[] = [
      {
        id: 1,
        official_name: "A",
        name: "A",
        name_jp: "A",
        country: "X",
        region: "Y",
        state_party: "JPN",
        category: "Cultural",
        criteria: ["i"],
        year_inscribed: 1993,
        area_hectares: null,
        buffer_zone_hectares: null,
        is_endangered: false,
        latitude: null,
        longitude: null,
        short_description: "",
        unesco_site_url: "https://ex.com/1",
        state_party_codes: ["JPN"],
        state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
        thumbnail: null,
      },
    ];
    const vmList: WorldHeritageVm[] = [
      {
        id: 1,
        officialName: "A",
        name: "A",
        nameJp: "A",
        country: "X",
        region: "Y",
        stateParty: "JPN",
        category: "Cultural",
        criteria: ["i"],
        yearInscribed: 1993,
        areaHectares: null,
        bufferZoneHectares: null,
        isEndangered: false,
        latitude: null,
        longitude: null,
        shortDescription: "",
        unescoSiteUrl: "https://ex.com/1",
        statePartyCodes: ["JPN"],
        statePartiesMeta: { JPN: { isPrimary: true, inscriptionYear: 1993 } },
        // 派生
        thumbnail: undefined,
        title: "A",
        subtitle: "X · Y",
        areaText: "—",
        bufferText: "—",
        criteriaText: "i",
      },
    ];

    mockFetch.mockResolvedValueOnce(dtoList);
    mockMap.mockReturnValueOnce(vmList);

    const { result } = renderHook(() => useTopPage());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {});

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockMap).toHaveBeenCalledWith(dtoList);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.items).toEqual(vmList);
  });

  it("reload() 連打でも最後の結果だけ反映（前回は Abort 扱い）", async () => {
    let rejectFirst!: (e: unknown) => void;
    const firstPromise = new Promise<ApiWorldHeritageDto[]>((_, rej) => {
      rejectFirst = rej;
    });
    mockFetch.mockImplementationOnce(() => firstPromise);

    const dto2: ApiWorldHeritageDto[] = [];
    const vm2: WorldHeritageVm[] = [];
    mockFetch.mockResolvedValueOnce(dto2);
    mockMap.mockReturnValueOnce(vm2);

    const { result } = renderHook(() => useTopPage());

    await act(async () => {
      result.current.reload();
    });
    await act(async () => {});
    await act(async () => {
      rejectFirst({ name: "AbortError" });
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.current.items).toEqual(vm2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("エラー時は isError と error がセットされる", async () => {
    const boom = new Error("boom");
    mockFetch.mockRejectedValueOnce(boom);

    const { result } = renderHook(() => useTopPage());

    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(boom);
    expect(result.current.items).toEqual([]);
  });
});
