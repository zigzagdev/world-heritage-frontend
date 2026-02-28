/** @jest-environment jsdom */

import { jest } from "@jest/globals";

jest.mock("../../apis", () => ({
  fetchWorldHeritageDetail: jest.fn(),
}));

jest.mock("@features/heritages/mappers/to-world-heritage-detail-vm", () => ({
  toWorldHeritageDetailVm: jest.fn(),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useWorldHeritageDetail } from "../use-world-heritage-detail";
import { fetchWorldHeritageDetail } from "../../apis";
import { toWorldHeritageDetailVm } from "@features/heritages/mappers/to-world-heritage-detail-vm";
import type {
  WorldHeritageDetailVm,
  ApiWorldHeritageDetailDto,
} from "../../../../../domain/types.ts";

type MinimalAbortSignal = { aborted: boolean };
interface MinimalAbortController {
  readonly signal: MinimalAbortSignal;
  abort(): void;
}
type AbortControllerCtor = new () => MinimalAbortController;

if (!("AbortController" in globalThis) || typeof globalThis.AbortController !== "function") {
  class FakeAbortController implements MinimalAbortController {
    private _signal: MinimalAbortSignal = { aborted: false };
    get signal(): MinimalAbortSignal {
      return this._signal;
    }
    abort(): void {
      this._signal.aborted = true;
    }
  }
  (globalThis as { AbortController: AbortControllerCtor }).AbortController = FakeAbortController;
}

type FetchFn = (id: string, opts?: { signal?: AbortSignal }) => Promise<unknown>;
const fetchWorldHeritageDetailMock =
  fetchWorldHeritageDetail as unknown as jest.MockedFunction<FetchFn>;

type MapFn = (dto: unknown) => WorldHeritageDetailVm;
const toWorldHeritageDetailVmMock =
  toWorldHeritageDetailVm as unknown as jest.MockedFunction<MapFn>;

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (v: T) => void;
  reject: (e: unknown) => void;
};
const deferred = <T>(): Deferred<T> => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("useWorldHeritageDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("初期マウント直後: isLoading=true, item=null, isError=false", () => {
    const d = deferred<unknown>();
    fetchWorldHeritageDetailMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useWorldHeritageDetail("1"));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.item).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  test("成功パス: fetch -> map -> state 反映", async () => {
    const raw: ApiWorldHeritageDetailDto = {
      id: 1,
      official_name: "Historic Monuments of Ancient Kyoto",
      name: "Historic Monuments of Ancient Kyoto",
      heritage_name_jp: "古都京都の文化財",
      country: "Japan",
      country_name_jp: "日本",
      region: "Asia",
      category: "Cultural",
      year_inscribed: 1994,
      latitude: 35.0116,
      longitude: 135.7681,
      is_endangered: false,
      criteria: ["ii", "iv"],
      area_hectares: null,
      buffer_zone_hectares: null,
      short_description: "A group of historic sites in Kyoto.",
      unesco_site_url: "https://example.com/kyoto",
      state_party: "Japan",
      state_party_codes: ["JPN"],
      state_parties_meta: [],
      primary_state_party_code: "JPN",
      thumbnail_url: null,
      images: [],
    };

    const vm: WorldHeritageDetailVm = {
      id: 1,
      officialName: raw.official_name,
      name: raw.name,
      heritageNameJp: raw.heritage_name_jp,
      country: raw.country,
      countryNameJp: raw.country_name_jp,
      region: raw.region,
      category: raw.category,
      yearInscribed: raw.year_inscribed,
      latitude: raw.latitude,
      longitude: raw.longitude,
      isEndangered: raw.is_endangered,
      criteria: ["ii", "iv"],
      areaHectares: null,
      bufferZoneHectares: null,
      shortDescription: raw.short_description,
      unescoSiteUrl: raw.unesco_site_url,
      stateParty: raw.state_party,
      statePartyCodes: ["JPN"],
      statePartiesMeta: {},
      primaryStatePartyCode: "JPN",
      thumbnailUrl: null,
      images: [],
      title: raw.official_name,
      subtitle: "Japan · Asia",
      areaText: "—",
      bufferText: "—",
      criteriaText: "ii, iv",
    };

    const Deferred = deferred<unknown>();
    fetchWorldHeritageDetailMock.mockImplementation(() => Deferred.promise);
    toWorldHeritageDetailVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useWorldHeritageDetail("1"));

    await act(async () => {
      Deferred.resolve(raw);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.item).toEqual(vm);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(fetchWorldHeritageDetailMock).toHaveBeenCalledTimes(1);
    expect(fetchWorldHeritageDetailMock).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        signal: expect.any(Object),
      }),
    );
    expect(toWorldHeritageDetailVmMock).toHaveBeenCalledTimes(1);
    expect(toWorldHeritageDetailVmMock).toHaveBeenCalledWith(raw);
  });

  test("id が null の場合: errorにせず、API は呼ばれない", async () => {
    const { result } = renderHook(() => useWorldHeritageDetail(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.item).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(fetchWorldHeritageDetailMock).not.toHaveBeenCalled();
    expect(toWorldHeritageDetailVmMock).not.toHaveBeenCalled();
  });

  test("通常エラー: isError=true, item=null, isLoading=false, error が保持される", async () => {
    const Deferred = deferred<unknown>();
    fetchWorldHeritageDetailMock.mockImplementation(() => Deferred.promise);

    const { result } = renderHook(() => useWorldHeritageDetail("1"));

    const boom = new Error("boom");
    await act(async () => {
      Deferred.reject(boom);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.item).toBeNull();
      expect(result.current.error).toBe(boom);
    });
  });

  test("AbortError は無視される（エラー状態にしない）", async () => {
    const first = deferred<unknown>();
    const second = deferred<unknown>();

    const calls: Array<{ id: string; signal?: AbortSignal }> = [];
    fetchWorldHeritageDetailMock.mockImplementation((id, opts) => {
      calls.push({ id, signal: opts?.signal });
      return calls.length === 1 ? first.promise : second.promise;
    });

    const vm: WorldHeritageDetailVm = {
      id: 2,
      officialName: "Official",
      name: "Ok",
      heritageNameJp: "名前",
      country: "Japan",
      countryNameJp: "日本",
      region: "Asia",
      category: "Cultural",
      yearInscribed: 2000,
      latitude: null,
      longitude: null,
      isEndangered: false,
      criteria: [],
      areaHectares: null,
      bufferZoneHectares: null,
      shortDescription: "dummy",
      unescoSiteUrl: "https://example.com",
      stateParty: "Japan",
      statePartyCodes: [],
      statePartiesMeta: {},
      primaryStatePartyCode: null,
      thumbnailUrl: null,
      images: [],
      title: "Ok",
      subtitle: "Japan · Asia",
      areaText: "—",
      bufferText: "—",
      criteriaText: "",
    };

    toWorldHeritageDetailVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useWorldHeritageDetail("2"));
    await act(async () => {
      result.current.reload();
    });

    await act(async () => {
      first.reject({ name: "AbortError" });
      await Promise.resolve();
    });

    await act(async () => {
      second.resolve({});
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.item).toEqual(vm);
    });

    expect(calls).toHaveLength(2);
    expect(calls[0].signal?.aborted).toBe(true);
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const Deferred = deferred<unknown>();
    const captured: Array<{ id: string; signal?: AbortSignal }> = [];

    fetchWorldHeritageDetailMock.mockImplementation((id, opts) => {
      captured.push({ id, signal: opts?.signal });
      return Deferred.promise;
    });

    const { unmount } = renderHook(() => useWorldHeritageDetail("1"));
    unmount();

    expect(captured[0]).toBeDefined();
    expect(captured[0]?.signal?.aborted).toBe(true);
  });
});
