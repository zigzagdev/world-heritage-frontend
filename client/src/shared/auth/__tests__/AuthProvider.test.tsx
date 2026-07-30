/** @jest-environment jsdom */

const getCurrentUserMock = jest.fn();

jest.mock("@features/auth/apis", () => ({
  getCurrentUser: (...args: unknown[]) => getCurrentUserMock(...args),
}));

import { StrictMode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider } from "../AuthProvider";
import { useAuth } from "../AuthHooks";
import type { ApiCurrentUserDto } from "@features/auth/apis/auth-api.ts";

const user: ApiCurrentUserDto = {
  id: 1,
  first_name: "Taro",
  last_name: "Yamada",
  email: "taro@example.com",
};

type LogEntry = { isLoading: boolean; user: unknown };

function Probe({ log }: { log: LogEntry[] }) {
  const { isLoading, user } = useAuth();
  log.push({ isLoading, user });
  return <div data-testid="state">{isLoading ? "loading" : user ? "authed" : "guest"}</div>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.setItem("auth_token", "tok-123");
    getCurrentUserMock.mockReset();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("does not report logged-out while the request from a StrictMode-duplicated effect is still in flight", async () => {
    getCurrentUserMock.mockImplementation(
      (_token: string, init?: { signal?: AbortSignal }) =>
        new Promise((resolve, reject) => {
          const signal = init?.signal;
          if (signal?.aborted) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
          }
          const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
          signal?.addEventListener("abort", onAbort);
          setTimeout(() => {
            signal?.removeEventListener("abort", onAbort);
            resolve(user);
          }, 20);
        }),
    );

    const log: LogEntry[] = [];

    render(
      <StrictMode>
        <AuthProvider>
          <Probe log={log} />
        </AuthProvider>
      </StrictMode>,
    );

    await waitFor(() => expect(screen.getByTestId("state").textContent).toBe("authed"));

    const wronglyReportedLoggedOut = log.some((entry) => !entry.isLoading && entry.user === null);
    expect(wronglyReportedLoggedOut).toBe(false);
  });
});
