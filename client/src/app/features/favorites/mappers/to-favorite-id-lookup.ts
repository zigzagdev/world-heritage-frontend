import type { ApiWorldHeritageDto } from "../../../../domain/types.ts";

export type FavoriteIdLookup = Record<number, true>;

export const toFavoriteIdLookup = (dtos: ApiWorldHeritageDto[]): FavoriteIdLookup =>
  Object.fromEntries(dtos.map((dto) => [dto.id, true]));
