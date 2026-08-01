export type FavoritesApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

export type AddFavoriteRequest = {
  user_id: number;
  heritage_id: number;
  is_liked: boolean;
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
  const favoritesEndpoint = `${base}/api/v1/users/me/favorites`;

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

    async removeFavorite(heritageId: number, token: string, init?: RequestInit): Promise<void> {
      const response = await fetchImpl(`${favoritesEndpoint}/${heritageId}`, {
        ...init,
        method: "DELETE",
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
  };
};
