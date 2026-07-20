import type { AgeRange, SubscriptionTier } from "../types";

export type UserApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

export type CreateUserRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type ApiUserDto = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  age_range: AgeRange;
  subscription_tier: SubscriptionTier;
  subscription_expires_at: string | null;
};

export type ApiCreateUserResponse =
  | { status: "success"; data: ApiUserDto }
  | { status: "error"; data: unknown };

const normalizeApiBase = (apiBase: string): string => apiBase.replace(/\/+$/, "");

export const createUserApi = ({ apiBase, fetchImpl = fetch }: UserApiDeps) => {
  if (!apiBase) {
    throw new Error("apiBase is required");
  }

  const base = normalizeApiBase(apiBase);
  const endpoint = `${base}/api/v1/users`;

  const withCommonInit = (init?: RequestInit): RequestInit => ({
    ...init,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: init?.credentials ?? "omit",
    signal: init?.signal,
  });

  return {
    async createUser(request: CreateUserRequest, init?: RequestInit): Promise<ApiUserDto> {
      const response = await fetchImpl(endpoint, {
        ...withCommonInit(init),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = (await response.json()) as ApiCreateUserResponse;
      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }

      return json.data;
    },
  };
};
