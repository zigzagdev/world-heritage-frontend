import type { ApiWorldHeritageDto } from "../../../../domain/types.ts";

export type FavoritesApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

export type AddFavoriteRequest = {
  world_heritage_id: number;
};

type ApiEnvelope<T> = {
  status: string;
  data: T;
};

const normalizeApiBase = (apiBase: string): string => apiBase.replace(/\/+$/, "");

const withAuthHeader = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
});

export const createFavoritesApi = ({ apiBase, fetchImpl = fetch }: FavoritesApiDeps) => {
  if (!apiBase) {
    throw new Error("apiBase is required");
  }

  const base = normalizeApiBase(apiBase);
  const favoritesEndpoint = `${base}/api/v1/favorites`;

  return {
    async addFavorite(
      request: AddFavoriteRequest,
      token: string,
      init?: RequestInit,
    ): Promise<void> {
      const response = await fetchImpl(favoritesEndpoint, {
        ...init,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...withAuthHeader(token),
          ...(init?.headers ?? {}),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    },

    async getFavorites(token: string, init?: RequestInit): Promise<ApiWorldHeritageDto[]> {
      const response = await fetchImpl(favoritesEndpoint, {
        ...init,
        method: "GET",
        headers: {
          Accept: "application/json",
          ...withAuthHeader(token),
          ...(init?.headers ?? {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const body = (await response.json()) as ApiEnvelope<ApiWorldHeritageDto[]>;
      return body.data;
    },
  };
};
