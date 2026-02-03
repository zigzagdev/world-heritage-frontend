import { describe, it, expect } from "@jest/globals";
import { toWorldHeritageVm, toWorldHeritageListVm } from "../to-world-heritage-vm.ts";
import type {
  ApiWorldHeritageDto,
  ApiWorldHeritageImageDto,
  WorldHeritageVm,
} from "../../types.ts";

const image: ApiWorldHeritageImageDto = {
  id: 11224,
  url: "https://whc.unesco.org/document/209295/site_0661_0026.jpg",
  sort_order: 0,
  width: 0,
  height: 0,
  format: "jpg",
  alt: null,
  credit: null,
  is_primary: true,
  checksum: "abcd1234",
};

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
  images: [image],
  image_url: image,
  primary_state_party_code: "JPN",
};

describe("toWorldHeritageVm", () => {
  it("view model is mapping correctly and derived values are formatted correctly", () => {
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
      statePartyCodes: ["日本"],
      statePartiesMeta: { JPN: { isPrimary: true, inscriptionYear: 1993 } },
      primaryStatePartyCode: "JPN",
      title: "Shirakami-Sanchi",
      subtitle: "Japan · Asia",
      areaText: "442 ha",
      bufferText: "320 ha",
      criteriaText: "ix, x",
      thumbnail: {
        id: 11224,
        url: "https://whc.unesco.org/document/209295/site_0661_0026.jpg",
        // ✅ mapper が title で埋めてる挙動に合わせる
        alt: "Shirakami-Sanchi",
        credit: null,
        width: 0,
        height: 0,
        isPrimary: true,
      },
    };

    expect(vm).toStrictEqual(expected);
  });

  it("if official name is empty, using name as title", () => {
    const vm = toWorldHeritageVm({ ...base, official_name: "" });
    expect(vm.title).toBe("Shirakami-Sanchi");
  });

  it("when area/buffer are null, text becomes —; and when no image is available, thumbnail becomes null", () => {
    // ✅ thumbnail を null にしたいなら、image_url / images を消す必要がある
    const vm = toWorldHeritageVm({
      ...base,
      area_hectares: null,
      buffer_zone_hectares: null,
      image_url: null,
      images: [],
    });

    expect(vm.areaText).toBe("—");
    expect(vm.bufferText).toBe("—");
    expect(vm.thumbnail).toBeNull();
  });

  it("input dto is immutable", () => {
    const dto: ApiWorldHeritageDto = { ...base, criteria: ["x", "ix", "ix"] };
    const snapshot = [...dto.criteria];

    const vm = toWorldHeritageVm(dto);

    expect(dto.criteria).toStrictEqual(snapshot);
    expect(vm.criteria).toStrictEqual(["ix", "x"]);
  });

  it("thumbnail uses image_url when present", () => {
    const vm = toWorldHeritageVm({
      ...base,
      image_url: image,
      images: [],
    });

    expect(vm.thumbnail).toStrictEqual({
      id: 11224,
      url: "https://whc.unesco.org/document/209295/site_0661_0026.jpg",
      // ✅ここも同じ
      alt: "Shirakami-Sanchi",
      credit: null,
      width: 0,
      height: 0,
      isPrimary: true,
    });
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
