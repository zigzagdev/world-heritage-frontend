import { describe, it, expect } from "@jest/globals";
import { toWorldHeritageVm, toWorldHeritageListVm } from "../to-world-heritage-vm.ts";
import type { ApiWorldHeritageDto } from "../../../../../domain/types.ts";

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
  short_description_jp: "ダミー",
  unesco_site_url: "https://whc.unesco.org/en/list/663",
  state_party: "JPN",
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  thumbnail: "https://whc.unesco.org/document/209295/site_0661_0026.jpg",
};

describe("toWorldHeritageVm", () => {
  it("ja: maps core fields + derived values using Japanese labels", () => {
    const vm = toWorldHeritageVm(base, "ja");

    expect(vm).toMatchObject({
      id: 663,
      officialName: "Shirakami-Sanchi",
      name: "Shirakami-Sanchi",
      heritageNameJp: "白神山地",
      country: "日本",
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
      shortDescriptionJp: "ダミー",
      unescoSiteUrl: "https://whc.unesco.org/en/list/663",
      primaryStatePartyCode: null,
      criteriaText: "ix, x",
      title: "白神山地",
      subtitle: "日本 · Asia",
      displayDescription: "ダミー",
      areaText: "442 ha",
      bufferText: "320 ha",
      statePartyCodes: ["日本"],
      statePartiesMeta: { JPN: { isPrimary: true, inscriptionYear: 1993 } },
      thumbnailUrl: base.thumbnail,
      images: [],
    });

    expect(vm.criteria).toStrictEqual(["ix", "x"]);
    // 英名 (Shirakami-Sanchi) は日本語タイトル (白神山地) と異なるので併記対象
    expect(vm.displaySubName).toBe("Shirakami-Sanchi");
  });

  it("en: title/country/description fall back to English fields", () => {
    const vm = toWorldHeritageVm(base, "en");

    expect(vm.title).toBe("Shirakami-Sanchi");
    expect(vm.country).toBe("Japan");
    expect(vm.subtitle).toBe("Japan · Asia");
    expect(vm.displayDescription).toBe("desc");
    expect(vm.displaySubName).toBeNull();
  });

  it("ja: if official_name is empty, falls back to heritage_name_jp for title", () => {
    const vm = toWorldHeritageVm({ ...base, official_name: "" }, "ja");
    expect(vm.title).toBe("白神山地");
  });

  it("ja: if Japanese description is missing, falls back to English short_description", () => {
    const vm = toWorldHeritageVm({ ...base, short_description_jp: null }, "ja");
    expect(vm.displayDescription).toBe("desc");
  });

  it("when area/buffer are null, text becomes —", () => {
    const vm = toWorldHeritageVm(
      {
        ...base,
        area_hectares: null,
        buffer_zone_hectares: null,
      },
      "ja",
    );

    expect(vm.areaText).toBe("—");
    expect(vm.bufferText).toBe("—");
  });

  it("when thumbnail is null, thumbnailUrl is null", () => {
    const vm = toWorldHeritageVm({ ...base, thumbnail: null }, "ja");
    expect(vm.thumbnailUrl).toBeNull();
  });

  it("input dto is immutable (criteria not mutated)", () => {
    const dto: ApiWorldHeritageDto = { ...base, criteria: ["x", "ix", "ix"] };
    const snapshot = [...dto.criteria];

    const vm = toWorldHeritageVm(dto, "ja");

    expect(dto.criteria).toStrictEqual(snapshot);
    expect(vm.criteria).toStrictEqual(["ix", "x"]);
  });

  it("unesco_site_url can be null (mapper should not crash)", () => {
    const vm = toWorldHeritageVm({ ...base, unesco_site_url: null }, "ja");
    expect(vm.unescoSiteUrl).toBeNull();
  });
});

describe("toWorldHeritageListVm", () => {
  it("maps dto array into view model array", () => {
    const vms = toWorldHeritageListVm([base, { ...base, id: 661 }], "ja");
    expect(vms).toHaveLength(2);
    expect(vms[0].id).toBe(663);
    expect(vms[1].id).toBe(661);
  });
});
