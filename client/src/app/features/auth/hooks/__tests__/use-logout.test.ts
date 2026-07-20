/** @jest-environment jsdom */

import { jest } from "@jest/globals";

const setUserMock = jest.fn();
const getStoredTokenMock = jest.fn();
const clearStoredTokenMock = jest.fn();

jest.mock("../../apis", () => ({
  logout: jest.fn(),
}));

jest.mock("@shared/auth/token-storage.ts", () => ({
  getStoredToken: getStoredTokenMock,
  clearStoredToken: clearStoredTokenMock,
}));

jest.mock("@shared/auth/AuthHooks.ts", () => ({
  useAuth: () => ({ setUser: setUserMock }),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useLogout } from "../use-logout";
import { logout } from "../../apis";

const logoutMock = logout as jest.MockedFunction<typeof logout>;
const TOKEN = "1|abcdef";

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

describe("useLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStoredTokenMock.mockReturnValue(TOKEN);
  });

  test("初期状態: isLoading=false, error=null", () => {
    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("成功パス: logout 呼び出し後、トークンがクリアされ setUser(null) される", async () => {
    const d = deferred<void>();
    logoutMock.mockImplementation(() => d.promise);

    const { result } = renderHook(() => useLogout());

    let submitPromise!: Promise<boolean>;
    act(() => {
      submitPromise = result.current.submit();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      d.resolve(undefined);
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(await submitPromise).toBe(true);
    expect(logoutMock).toHaveBeenCalledWith(
      TOKEN,
      expect.objectContaining({ signal: expect.any(Object) }),
    );
    expect(clearStoredTokenMock).toHaveBeenCalled();
    expect(setUserMock).toHaveBeenCalledWith(null);
  });

  test("失敗パス: error に反映され、setUser は呼ばれない", async () => {
    const boom = new Error("boom");
    logoutMock.mockRejectedValue(boom);

    const { result } = renderHook(() => useLogout());

    let submitPromise!: Promise<boolean>;
    await act(async () => {
      submitPromise = result.current.submit();
      await submitPromise;
    });

    expect(await submitPromise).toBe(false);
    expect(result.current.error).toBe(boom);
    expect(setUserMock).not.toHaveBeenCalled();
  });
});
