import { describe, it, expect } from "@jest/globals";
import { toWorldHeritageVm, toWorldHeritageListVm } from "./to-world-heritage-vm.js";
import type { ApiWorldHeritageDto, WorldHeritageVm } from "../types";

const base: ApiWorldHeritageDto = {
  id: 663,
  official_name: "Shirakami-Sanchi",
  name: "Shirakami-Sanchi",
  name_jp: "白神山地",
  country: "Japan",
  region: "Asia",
  state_party: "JPN",
  category: "Natural",
  criteria: ["x", "ix"],
  year_inscribed: 1993,
  area_hectares: 442,
  buffer_zone_hectares: 320,
  is_endangered: false,
  latitude: null,
  longitude: null,
  short_description: "desc",
  unesco_site_url: "https://whc.unesco.org/en/list/663",
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  thumbnail: "https://example.com/img.jpg",
};

describe("toWorldHeritageVm", () => {
  it("view model is mapping correctly and, Derived values are also formatted correctly", () => {
    const vm = toWorldHeritageVm(base);

    const expected: WorldHeritageVm = {
      id: 663,
      officialName: "Shirakami-Sanchi",
      name: "Shirakami-Sanchi",
      nameJp: "白神山地",
      country: "Japan",
      region: "Asia",
      stateParty: "JPN",
      category: "Natural",
      criteria: ["ix", "x"],
      yearInscribed: 1993,
      areaHectares: 442,
      bufferZoneHectares: 320,
      isEndangered: false,
      latitude: null,
      longitude: null,
      shortDescription: "desc",
      unescoSiteUrl: "https://whc.unesco.org/en/list/663",
      statePartyCodes: ["JPN"],
      statePartiesMeta: { JPN: { isPrimary: true, inscriptionYear: 1993 } },
      thumbnail: "https://example.com/img.jpg",

      title: "Shirakami-Sanchi",
      subtitle: "Japan · Asia",
      areaText: "442 ha",
      bufferText: "320 ha",
      criteriaText: "ix, x",
    };

    expect(vm).toStrictEqual(expected);
  });

  it("if official name is null, using a title for name", () => {
    const vm = toWorldHeritageVm({ ...base, official_name: "" });
    expect(vm.title).toBe("Shirakami-Sanchi");
  });

  it("display null on correctly, and if thumbnail type is null or undefined, it's omitted.", () => {
    const vm = toWorldHeritageVm({
      ...base,
      area_hectares: null,
      buffer_zone_hectares: null,
      thumbnail: null,
    });

    expect(vm.areaText).toBe("—");
    expect(vm.bufferText).toBe("—");
    expect(vm.thumbnail).toBeUndefined();
  });

  it("input dto assert immutable", () => {
    const dto: ApiWorldHeritageDto = { ...base, criteria: ["x", "ix", "ix"] };
    const snapshot = [...dto.criteria];

    const vm = toWorldHeritageVm(dto);

    expect(dto.criteria).toStrictEqual(snapshot);
    expect(vm.criteria).toStrictEqual(["ix", "x"]);
  });
});

describe("toWorldHeritageListVm", () => {
  it("mapping dto array into view model array", () => {
    const vms = toWorldHeritageListVm([base, { ...base, id: 661 }]);
    expect(vms).toHaveLength(2);
    expect(vms[0].id).toBe(663);
    expect(vms[1].id).toBe(661);
  });
});
