/** @jest-environment jsdom */

import { jest } from "@jest/globals";

jest.mock("../../apis", () => ({
  getFavorites: jest.fn(),
}));

jest.mock("@features/heritages/mappers/to-world-heritage-vm.ts", () => ({
  toWorldHeritageListVm: jest.fn(),
}));

jest.mock("@shared/locale/LocaleHooks.ts", () => ({
  useLocale: jest.fn(),
}));

jest.mock("@shared/auth/token-storage.ts", () => ({
  getStoredToken: jest.fn(),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useFavorites } from "../use-favorites";
import { getFavorites } from "../../apis";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm.ts";
import { useLocale } from "@shared/locale/LocaleHooks.ts";
import { getStoredToken } from "@shared/auth/token-storage.ts";
import type { ApiWorldHeritageDto, WorldHeritageVm } from "../../../../../domain/types.ts";

type GetFn = (token: string, opts?: { signal?: AbortSignal }) => Promise<ApiWorldHeritageDto[]>;
const getFavoritesMock = getFavorites as unknown as jest.MockedFunction<GetFn>;

type MapFn = (dtos: ApiWorldHeritageDto[], locale: string) => WorldHeritageVm[];
const toWorldHeritageListVmMock = toWorldHeritageListVm as unknown as jest.MockedFunction<MapFn>;

const useLocaleMock = useLocale as unknown as jest.MockedFunction<() => { locale: string }>;
const getStoredTokenMock = getStoredToken as unknown as jest.MockedFunction<() => string | null>;

const dto: ApiWorldHeritageDto = {
  id: 1,
  official_name: "Official Name",
  name: "Name",
  heritage_name_jp: "名前",
  country: "Country",
  country_name_jp: "国名",
  region: "Asia",
  category: "Cultural",
  year_inscribed: 2000,
  latitude: 0,
  longitude: 0,
  is_endangered: false,
  criteria: ["i"],
  area_hectares: null,
  buffer_zone_hectares: null,
  short_description: "desc",
  short_description_jp: "説明",
  unesco_site_url: null,
  state_party: null,
  state_party_codes: [],
  state_parties_meta: {},
  thumbnail_url: null,
};

const vm = { id: 1 } as unknown as WorldHeritageVm;

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

describe("useFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocaleMock.mockReturnValue({ locale: "en" });
    getStoredTokenMock.mockReturnValue("1|abcdef");
    toWorldHeritageListVmMock.mockReturnValue([vm]);
  });

  test("初期状態: data=[], isLoading=true, error=null", () => {
    getFavoritesMock.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test("成功パス: mount時に getFavorites -> toWorldHeritageListVm の順で呼ばれ、data に反映される", async () => {
    const d = deferred<ApiWorldHeritageDto[]>();
    getFavoritesMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      d.resolve([dto]);
      await d.promise;
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([vm]);
    expect(result.current.error).toBeNull();
    expect(getFavoritesMock).toHaveBeenCalledWith(
      "1|abcdef",
      expect.objectContaining({ signal: expect.any(Object) }),
    );
    expect(toWorldHeritageListVmMock).toHaveBeenCalledWith([dto], "en");
  });

  test("未認証: tokenが無い場合はAPIを呼ばずdata=[]で完了する", async () => {
    getStoredTokenMock.mockReturnValue(null);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getFavoritesMock).not.toHaveBeenCalled();
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test("エラー: error に反映され、data は空のまま", async () => {
    const boom = new Error("boom");
    const d = deferred<ApiWorldHeritageDto[]>();
    getFavoritesMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      d.reject(boom);
      await d.promise.catch(() => {});
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(boom);
  });

  test("AbortError は無視される（エラー状態にしない）", async () => {
    const d = deferred<ApiWorldHeritageDto[]>();
    getFavoritesMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      d.reject(new DOMException("Aborted", "AbortError"));
      await d.promise.catch(() => {});
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeNull();
  });

  test("reload呼び出し時に前のリクエストを abort して再取得する", async () => {
    const first = deferred<ApiWorldHeritageDto[]>();
    const second = deferred<ApiWorldHeritageDto[]>();
    const signals: Array<AbortSignal | undefined> = [];

    getFavoritesMock.mockImplementation((_token, opts) => {
      signals.push(opts?.signal);
      return signals.length === 1 ? first.promise : second.promise;
    });

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => expect(signals).toHaveLength(1));

    act(() => {
      result.current.reload();
    });

    await waitFor(() => expect(signals).toHaveLength(2));
    expect(signals[0]?.aborted).toBe(true);

    await act(async () => {
      second.resolve([dto]);
      await second.promise;
    });

    await waitFor(() => expect(result.current.data).toEqual([vm]));
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<ApiWorldHeritageDto[]>();
    const signals: Array<AbortSignal | undefined> = [];

    getFavoritesMock.mockImplementation((_token, opts) => {
      signals.push(opts?.signal);
      return d.promise;
    });

    const { unmount } = renderHook(() => useFavorites());

    unmount();

    expect(signals[0]?.aborted).toBe(true);
  });
});
