import { describe, it, expect } from "@jest/globals";
import { toWorldHeritageVm, toWorldHeritageListVm } from "../to-world-heritage-vm.ts";
import type { ApiWorldHeritageDto, WorldHeritageVm } from "../../../../../domain/types.ts";

const base: ApiWorldHeritageDto = {
  id: 663,
  official_name: "Shirakami-Sanchi",
  name: "Shirakami-Sanchi",
  heritage_name_jp: "白神山地",
  country: "Japan",
  country_name_jp: "日本",
  region: "Asia",
  category: "Natural",
  year_inscribed: 1993,
  latitude: null,
  longitude: null,
  is_endangered: false,
  criteria: ["x", "ix"],
  area_hectares: 442,
  buffer_zone_hectares: 320,
  short_description: "desc",
  unesco_site_url: "https://whc.unesco.org/en/list/663",
  state_party: "JPN",
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  thumbnail: "https://whc.unesco.org/document/209295/site_0661_0026.jpg",
};

describe("toWorldHeritageVm", () => {
  it("maps core fields + derived values correctly (DTO shape: thumbnail string)", () => {
    const vm = toWorldHeritageVm(base);

    expect(vm).toMatchObject<Partial<WorldHeritageVm>>({
      id: 663,
      officialName: "Shirakami-Sanchi",
      name: "Shirakami-Sanchi",
      heritageNameJp: "白神山地",
      country: "Japan",
      countryNameJp: "日本",
      region: "Asia",
      stateParty: "JPN",
      category: "Natural",
      yearInscribed: 1993,
      areaHectares: 442,
      bufferZoneHectares: 320,
      isEndangered: false,
      latitude: null,
      longitude: null,
      shortDescription: "desc",
      unescoSiteUrl: "https://whc.unesco.org/en/list/663",
      primaryStatePartyCode: null,
      criteriaText: "ix, x",
      title: "Shirakami-Sanchi",
      subtitle: "Japan · Asia",
      areaText: "442 ha",
      bufferText: "320 ha",
      statePartyCodes: ["日本"],
      statePartiesMeta: { JPN: { isPrimary: true, inscriptionYear: 1993 } },
      thumbnailUrl: base.thumbnail,
      images: [],
    });

    expect(vm.criteria).toStrictEqual(["ix", "x"]);
  });

  it("if official_name is empty, uses name as title", () => {
    const vm = toWorldHeritageVm({ ...base, official_name: "" });
    expect(vm.title).toBe("Shirakami-Sanchi");
  });

  it("when area/buffer are null, text becomes —", () => {
    const vm = toWorldHeritageVm({
      ...base,
      area_hectares: null,
      buffer_zone_hectares: null,
    });

    expect(vm.areaText).toBe("—");
    expect(vm.bufferText).toBe("—");
  });

  it("when thumbnail is null, thumbnailUrl is null", () => {
    const vm = toWorldHeritageVm({ ...base, thumbnail: null });
    expect(vm.thumbnailUrl).toBeNull();
  });

  it("input dto is immutable (criteria not mutated)", () => {
    const dto: ApiWorldHeritageDto = { ...base, criteria: ["x", "ix", "ix"] };
    const snapshot = [...dto.criteria];

    const vm = toWorldHeritageVm(dto);

    expect(dto.criteria).toStrictEqual(snapshot);
    expect(vm.criteria).toStrictEqual(["ix", "x"]);
  });

  it("unesco_site_url can be null (mapper should not crash)", () => {
    const vm = toWorldHeritageVm({ ...base, unesco_site_url: null });
    expect(vm.unescoSiteUrl).toBeNull();
  });
});

describe("toWorldHeritageListVm", () => {
  it("maps dto array into view model array", () => {
    const vms = toWorldHeritageListVm([base, { ...base, id: 661 }]);
    expect(vms).toHaveLength(2);
    expect(vms[0].id).toBe(663);
    expect(vms[1].id).toBe(661);
  });
});
