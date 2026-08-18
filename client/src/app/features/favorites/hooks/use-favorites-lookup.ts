import { useContext } from "react";
import FavoritesLookupContext from "../FavoritesLookupProvider.tsx";

export const useFavoritesLookup = () => {
  const context = useContext(FavoritesLookupContext);
  if (!context) {
    throw new Error("useFavoritesLookup must be used within FavoritesLookupProvider");
  }
  return context;
};
