import { createFavoritesApi } from "./favorites-api.ts";

const apiBase = import.meta.env.VITE_API_BASE_URL;

if (!apiBase) {
  throw new Error("VITE_API_BASE_URL is not set");
}

const favoritesApi = createFavoritesApi({ apiBase });

export const addFavorite = favoritesApi.addFavorite;
export const removeFavorite = favoritesApi.removeFavorite;
export const getFavorites = favoritesApi.getFavorites;
