/** @jest-environment jsdom */

import { jest } from "@jest/globals";

const setUserMock = jest.fn();
const setStoredTokenMock = jest.fn();

const toLoginRequestMock = jest.fn();

jest.mock("../../apis", () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock("../../mapper/to-login-request", () => ({
  toLoginRequest: toLoginRequestMock,
}));

jest.mock("@shared/auth/token-storage.ts", () => ({
  setStoredToken: setStoredTokenMock,
}));

jest.mock("@shared/auth/AuthHooks.ts", () => ({
  useAuth: () => ({ setUser: setUserMock }),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { useLogin } from "../use-login";
import { login, getCurrentUser } from "../../apis";
import type { ApiCurrentUserDto, LoginResult } from "../../apis/auth-api";
import type { LoginFormValues } from "../../types";
import type { LoginRequest } from "../../apis/auth-api";

const loginMock = login as jest.MockedFunction<typeof login>;
const getCurrentUserMock = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;

const request: LoginRequest = { email: "taro@example.com", password: "password123" };

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

const values: LoginFormValues = { email: "taro@example.com", password: "password123" };

const loginResult: LoginResult = { token: "1|abcdef", tokenType: "Bearer" };

const user: ApiCurrentUserDto = {
  id: 1,
  first_name: "Taro",
  last_name: "Yamada",
  email: "taro@example.com",
};

describe("useLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toLoginRequestMock.mockReturnValue(request);
  });

  test("初期状態: isLoading=false, error=null", () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("成功パス: login → トークン保存 → getCurrentUser の順に呼ばれ、setUser に反映される", async () => {
    const d = deferred<LoginResult>();
    loginMock.mockImplementation(() => d.promise);
    getCurrentUserMock.mockResolvedValue(user);

    const { result } = renderHook(() => useLogin());

    let submitPromise!: Promise<boolean>;
    act(() => {
      submitPromise = result.current.submit(values);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      d.resolve(loginResult);
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(await submitPromise).toBe(true);
    expect(toLoginRequestMock).toHaveBeenCalledWith(values);
    expect(loginMock).toHaveBeenCalledWith(
      request,
      expect.objectContaining({ signal: expect.any(Object) }),
    );
    expect(setStoredTokenMock).toHaveBeenCalledWith(loginResult.token);
    expect(getCurrentUserMock).toHaveBeenCalledWith(
      loginResult.token,
      expect.objectContaining({ signal: expect.any(Object) }),
    );
    expect(setUserMock).toHaveBeenCalledWith(user);
  });

  test("ログイン失敗: error に反映され、setUser は呼ばれない", async () => {
    const boom = new Error("invalid credentials");
    loginMock.mockRejectedValue(boom);

    const { result } = renderHook(() => useLogin());

    let submitPromise!: Promise<boolean>;
    await act(async () => {
      submitPromise = result.current.submit(values);
      await submitPromise;
    });

    expect(await submitPromise).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(boom);
    expect(setUserMock).not.toHaveBeenCalled();
  });

  test("AbortError は無視される（エラー状態にしない）", async () => {
    loginMock.mockRejectedValue(new DOMException("Aborted", "AbortError"));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.submit(values);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});