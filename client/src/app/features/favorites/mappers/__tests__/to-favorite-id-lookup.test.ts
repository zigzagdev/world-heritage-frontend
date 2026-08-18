import { describe, it, expect } from "@jest/globals";
import { toFavoriteIdLookup } from "../to-favorite-id-lookup";
import type { ApiWorldHeritageDto } from "../../../../../domain/types.ts";

const makeHeritageDto = (overrides: Partial<ApiWorldHeritageDto> = {}): ApiWorldHeritageDto => ({
  id: 1,
  official_name: "Official Name",
  name: "Name",
  heritage_name_jp: "名前",
  country: "Country",
  country_name_jp: "国名",
  region: "Europe",
  category: "Cultural",
  year_inscribed: 2000,
  latitude: 0,
  longitude: 0,
  is_endangered: false,
  criteria: ["i"],
  area_hectares: null,
  buffer_zone_hectares: null,
  short_description: "desc",
  short_description_jp: "説明",
  unesco_site_url: null,
  state_party: null,
  state_party_codes: [],
  state_parties_meta: {},
  thumbnail_url: null,
  ...overrides,
});

describe("toFavoriteIdLookup", () => {
  it("converts a DTO list into an id lookup object", () => {
    const dtos = [makeHeritageDto({ id: 1 }), makeHeritageDto({ id: 5 })];

    expect(toFavoriteIdLookup(dtos)).toEqual({ 1: true, 5: true });
  });

  it("returns an empty object for an empty list", () => {
    expect(toFavoriteIdLookup([])).toEqual({});
  });
});
