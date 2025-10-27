import { toWorldHeritageVm, toWorldHeritageListVm } from "./to-world-heritage-vm";
import type { WorldHeritageDto } from "../types";
import { describe, it, expect } from "@jest/globals";

const base: WorldHeritageDto = {
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
  it("maps fields and formats derived values", () => {
    const vm = toWorldHeritageVm(base);

    expect(vm.id).toBe(663);
    expect(vm.officialName).toBe("Shirakami-Sanchi");
    expect(vm.nameJp).toBe("白神山地");
    expect(vm.country).toBe("Japan");
    expect(vm.region).toBe("Asia");
    expect(vm.stateParty).toBe("JPN");
    expect(vm.category).toBe("Natural");
    expect(vm.yearInscribed).toBe(1993);
    expect(vm.areaHectares).toBe(442);
    expect(vm.bufferZoneHectares).toBe(320);
    expect(vm.isEndangered).toBe(false);
    expect(vm.latitude).toBeNull();
    expect(vm.longitude).toBeNull();
    expect(vm.shortDescription).toBe("desc");
    expect(vm.unescoSiteUrl).toBe("https://whc.unesco.org/en/list/663");
    expect(vm.statePartyCodes).toEqual(["JPN"]);
    expect(vm.statePartiesMeta).toEqual({
      JPN: { isPrimary: true, inscriptionYear: 1993 },
    });
    expect(vm.thumbnail).toBe("https://example.com/img.jpg");

    expect(vm.criteria).toEqual(["ix", "x"]);
    expect(vm.title).toBe("Shirakami-Sanchi");
    expect(vm.subtitle).toBe("Japan · Asia");
    expect(vm.areaText).toBe("442 ha");
    expect(vm.bufferText).toBe("320 ha");
    expect(vm.criteriaText).toBe("ix, x");
  });

  it("falls back to name when official_name is empty", () => {
    const vm = toWorldHeritageVm({ ...base, official_name: "" });
    expect(vm.title).toBe("Shirakami-Sanchi");
  });

  it("handles nulls and removes thumbnail when null/undefined", () => {
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

  it("does not mutate input DTO", () => {
    const dto: WorldHeritageDto = {
      ...base,
      criteria: ["x", "ix", "ix"],
    };
    const original = [...dto.criteria];
    const vm = toWorldHeritageVm(dto);

    expect(dto.criteria).toEqual(original);
    expect(vm.criteria).toEqual(["ix", "x"]);
  });
});

describe("toWorldHeritageListVm", () => {
  it("maps a list of DTOs to VMs", () => {
    const vms = toWorldHeritageListVm([base, { ...base, id: 661 }]);
    expect(vms).toHaveLength(2);
    expect(vms[0].id).toBe(663);
    expect(vms[1].id).toBe(661);
  });
});
