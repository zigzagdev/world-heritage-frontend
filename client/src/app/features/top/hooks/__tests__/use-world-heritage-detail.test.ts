/** @jest-environment jsdom */

import { renderHook, act, waitFor } from "@testing-library/react";
import { jest, expect, test, beforeEach, describe } from "@jest/globals";
import { useWorldHeritageDetail } from "../use-world-heritage-detail";
import { fetchWorldHeritageDetail } from "../../apis";
import { toWorldHeritageVm } from "@features/heritages/mappers/to-world-heritage-vm";
import type { WorldHeritageDetailVm, ApiWorldHeritageDto } from "../../../../../domain/types.ts";

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

jest.mock("../../apis", () => ({
  fetchWorldHeritageDetail: jest.fn(),
}));

jest.mock("@features/heritages/mappers/to-world-heritage-vm", () => ({
  toWorldHeritageVm: jest.fn(),
}));

type FetchFn = (id: string, opts?: { signal?: AbortSignal }) => Promise<unknown>;
const fetchWorldHeritageDetailMock =
  fetchWorldHeritageDetail as unknown as jest.MockedFunction<FetchFn>;

type MapFn = (dto: unknown) => unknown;
const toWorldHeritageVmMock = toWorldHeritageVm as unknown as jest.MockedFunction<MapFn>;

// ---- deferred ヘルパ ----

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
    const raw: ApiWorldHeritageDto = {
      id: 1,
      official_name: "Historic Monuments of Ancient Kyoto",
      name: "Historic Monuments of Ancient Kyoto",
      name_jp: "古都京都の文化財",
      country: "Japan",
      region: "Asia",
      state_party: "Japan",
      category: "Cultural",
      criteria: ["ii", "iv"],
      year_inscribed: 1994,
      area_hectares: null,
      buffer_zone_hectares: null,
      is_endangered: false,
      latitude: 35.0116,
      longitude: 135.7681,
      short_description: "A group of historic sites in Kyoto.",
      unesco_site_url: "https://example.com/kyoto",
      state_party_codes: ["JPN"],
      state_parties_meta: [],
      primary_state_party_code: "JPN",
    };

    const vm: WorldHeritageDetailVm = {
      id: 1,
      officialName: "Historic Monuments of Ancient Kyoto",
      name: "Historic Monuments of Ancient Kyoto",
      nameJp: "古都京都の文化財",
      country: "Japan",
      region: "Asia",
      stateParty: "Japan",
      category: "Cultural",
      criteria: ["ii", "iv"],
      yearInscribed: 1994,
      areaHectares: null,
      bufferZoneHectares: null,
      isEndangered: false,
      latitude: 35.0116,
      longitude: 135.7681,
      shortDescription: "A group of historic sites in Kyoto.",
      unescoSiteUrl: "https://example.com/kyoto",
      statePartyCodes: ["JPN"],
      statePartiesMeta: {},
      primaryStatePartyCode: "JPN",
      thumbnail: null,
      title: "Historic Monuments of Ancient Kyoto",
      subtitle: "Japan · Asia",
      areaText: "—",
      bufferText: "—",
      criteriaText: "ii, iv",
      images: [],
    };

    const d = deferred<unknown>();
    fetchWorldHeritageDetailMock.mockImplementation(() => d.promise);
    toWorldHeritageVmMock.mockReturnValue(vm);

    const { result } = renderHook(() => useWorldHeritageDetail("1"));

    await act(async () => {
      d.resolve(raw);
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
    expect(toWorldHeritageVmMock).toHaveBeenCalledWith(raw);
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
  });

  test("通常エラー: isError=true, item=null, isLoading=false, error が保持される", async () => {
    const d = deferred<unknown>();
    fetchWorldHeritageDetailMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useWorldHeritageDetail("1"));

    const boom = new Error("boom");
    await act(async () => {
      d.reject(boom);
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
      nameJp: "名前",
      country: "Japan",
      region: "Asia",
      stateParty: "Japan",
      category: "Cultural",
      criteria: [],
      yearInscribed: 2000,
      areaHectares: null,
      bufferZoneHectares: null,
      isEndangered: false,
      latitude: null,
      longitude: null,
      shortDescription: "dummy",
      unescoSiteUrl: "https://example.com",
      statePartyCodes: [],
      statePartiesMeta: {},
      primaryStatePartyCode: null,
      thumbnail: null,
      title: "Ok",
      subtitle: "Japan · Asia",
      areaText: "—",
      bufferText: "—",
      criteriaText: "",
      images: [],
    };

    toWorldHeritageVmMock.mockReturnValue(vm);

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

    expect(calls.length).toBe(2);
    expect(calls[0].signal?.aborted).toBe(true);
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<unknown>();
    const captured: Array<{ id: string; signal?: AbortSignal }> = [];

    fetchWorldHeritageDetailMock.mockImplementation((id, opts) => {
      captured.push({ id, signal: opts?.signal });
      return d.promise;
    });

    const { unmount } = renderHook(() => useWorldHeritageDetail("1"));
    unmount();

    expect(captured[0]).toBeDefined();
    expect(captured[0]?.signal?.aborted).toBe(true);
  });
});
