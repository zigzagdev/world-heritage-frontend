/** @jest-environment jsdom */

import { jest } from "@jest/globals";

jest.mock("../../apis", () => ({
  getFavorites: jest.fn(),
}));

jest.mock("../../mappers/to-favorite-id-lookup", () => ({
  toFavoriteIdLookup: jest.fn(),
}));

jest.mock("@shared/auth/token-storage.ts", () => ({
  getStoredToken: jest.fn(),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useIsFavorited } from "../use-is-favorited";
import { getFavorites } from "../../apis";
import { toFavoriteIdLookup } from "../../mappers/to-favorite-id-lookup";
import { getStoredToken } from "@shared/auth/token-storage.ts";
import type { ApiWorldHeritageDto } from "../../../../../domain/types.ts";

type GetFn = (token: string, opts?: { signal?: AbortSignal }) => Promise<ApiWorldHeritageDto[]>;
const getFavoritesMock = getFavorites as unknown as jest.MockedFunction<GetFn>;

type MapFn = (dtos: ApiWorldHeritageDto[]) => Record<number, true>;
const toFavoriteIdLookupMock = toFavoriteIdLookup as unknown as jest.MockedFunction<MapFn>;

const getStoredTokenMock = getStoredToken as unknown as jest.MockedFunction<() => string | null>;

const dto = { id: 1 } as unknown as ApiWorldHeritageDto;

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

describe("useIsFavorited", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStoredTokenMock.mockReturnValue("1|abcdef");
    toFavoriteIdLookupMock.mockReturnValue({ 1: true });
  });

  test("初期状態: isLoading=true, error=null, isFavoritedは常にfalse", () => {
    getFavoritesMock.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useIsFavorited());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isFavorited(1)).toBe(false);
  });

  test("成功パス: lookupに含まれるidはtrue、含まれないidはfalseを返す", async () => {
    const d = deferred<ApiWorldHeritageDto[]>();
    getFavoritesMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useIsFavorited());

    await act(async () => {
      d.resolve([dto]);
      await d.promise;
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isFavorited(1)).toBe(true);
    expect(result.current.isFavorited(999)).toBe(false);
    expect(getFavoritesMock).toHaveBeenCalledWith(
      "1|abcdef",
      expect.objectContaining({ signal: expect.any(Object) }),
    );
    expect(toFavoriteIdLookupMock).toHaveBeenCalledWith([dto]);
  });

  test("未認証: tokenが無い場合はAPIを呼ばずisFavoritedは常にfalse", async () => {
    getStoredTokenMock.mockReturnValue(null);

    const { result } = renderHook(() => useIsFavorited());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getFavoritesMock).not.toHaveBeenCalled();
    expect(result.current.isFavorited(1)).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("エラー: error に反映され、isFavoritedはfalseのまま", async () => {
    const boom = new Error("boom");
    const d = deferred<ApiWorldHeritageDto[]>();
    getFavoritesMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useIsFavorited());

    await act(async () => {
      d.reject(boom);
      await d.promise.catch(() => {});
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe(boom);
    expect(result.current.isFavorited(1)).toBe(false);
  });

  test("AbortError は無視される（エラー状態にしない）", async () => {
    const d = deferred<ApiWorldHeritageDto[]>();
    getFavoritesMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useIsFavorited());

    await act(async () => {
      d.reject(new DOMException("Aborted", "AbortError"));
      await d.promise.catch(() => {});
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeNull();
  });

  test("アンマウント時に現在のリクエストを abort する", () => {
    const d = deferred<ApiWorldHeritageDto[]>();
    const signals: Array<AbortSignal | undefined> = [];

    getFavoritesMock.mockImplementation((_token, opts) => {
      signals.push(opts?.signal);
      return d.promise;
    });

    const { unmount } = renderHook(() => useIsFavorited());

    unmount();

    expect(signals[0]?.aborted).toBe(true);
  });
});
