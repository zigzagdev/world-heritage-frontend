export type AuthApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
  tokenType: string;
};

export type ApiCurrentUserDto = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type ApiEnvelope<T> = {
  status: string;
  data: T;
};

const normalizeApiBase = (apiBase: string): string => apiBase.replace(/\/+$/, "");

const withAuthHeader = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
});

export const createAuthApi = ({ apiBase, fetchImpl = fetch }: AuthApiDeps) => {
  if (!apiBase) {
    throw new Error("apiBase is required");
  }

  const base = normalizeApiBase(apiBase);

  return {
    async login(request: LoginRequest, init?: RequestInit): Promise<LoginResult> {
      const response = await fetchImpl(`${base}/api/v1/user/login`, {
        ...init,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const body = (await response.json()) as ApiEnvelope<{ token: string; token_type: string }>;
      return { token: body.data.token, tokenType: body.data.token_type };
    },

    async logout(token: string, init?: RequestInit): Promise<void> {
      const response = await fetchImpl(`${base}/api/v1/user/logout`, {
        ...init,
        method: "POST",
        headers: {
          Accept: "application/json",
          ...withAuthHeader(token),
          ...(init?.headers ?? {}),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    },

    async getCurrentUser(token: string, init?: RequestInit): Promise<ApiCurrentUserDto | null> {
      const response = await fetchImpl(`${base}/api/v1/user/me`, {
        ...init,
        method: "GET",
        headers: {
          Accept: "application/json",
          ...withAuthHeader(token),
          ...(init?.headers ?? {}),
        },
      });

      if (response.status === 401) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const body = (await response.json()) as ApiEnvelope<ApiCurrentUserDto>;
      return body.data;
    },
  };
};
