/** @jest-environment jsdom */

import { describe, it, expect } from "@jest/globals";
import { toWorldHeritageDetailVm } from "../to-world-heritage-detail-vm.ts";
import type {
  ApiWorldHeritageDetailDto,
  ApiWorldHeritageImageDto,
  WorldHeritageDetailVm,
} from "../../../../../domain/types.ts";

const img = (overrides: Partial<ApiWorldHeritageImageDto> = {}): ApiWorldHeritageImageDto => ({
  id: 1,
  url: "http://localhost/storage/world_heritage/661/img1.jpg",
  sort_order: 1,
  width: 1200,
  height: 800,
  format: "jpg",
  alt: null,
  credit: "seed1",
  is_primary: true,
  checksum: "dummy1",
  ...overrides,
});

const baseDto = (
  overrides: Partial<ApiWorldHeritageDetailDto> = {},
): ApiWorldHeritageDetailDto => ({
  id: 661,
  official_name: "Himeji-jo Official",
  name: "Himeji-jo",
  heritage_name_jp: "姫路城",
  country: "Japan",
  country_name_jp: "日本",
  region: "Asia",
  category: "Cultural",
  year_inscribed: 1993,
  latitude: 34.8394,
  longitude: 134.6939,
  is_endangered: false,
  criteria: ["i", "iv"],
  area_hectares: 107,
  buffer_zone_hectares: 143,
  short_description: "dummy",
  unesco_site_url: "https://example.com",
  state_party: null,
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  primary_state_party_code: "JPN",
  thumbnail_url: "https://whc.unesco.org/document/209295/site_0661_0026.jpg",
  images: [],
  ...overrides,
});

describe("toWorldHeritageDetailVm", () => {
  it("maps base fields and attaches sorted image VMs", () => {
    const dto = baseDto({
      images: [
        img({
          id: 2,
          sort_order: 2,
          alt: "custom alt 2",
          is_primary: false,
          credit: "seed2",
          url: "http://localhost/storage/world_heritage/661/img2.jpg",
        }),
        img({ id: 1, sort_order: 1, alt: null, is_primary: true }),
      ],
    });

    const vm: WorldHeritageDetailVm = toWorldHeritageDetailVm(dto);

    expect(vm.id).toBe(dto.id);
    expect(vm.title).toBe(dto.official_name);
    expect(vm.country).toBe(dto.country);
    expect(vm.countryNameJp).toBe(dto.country_name_jp);
    expect(vm.region).toBe(dto.region);

    // detail 差分
    expect(vm.primaryStatePartyCode).toBe("JPN");
    expect(vm.thumbnailUrl).toBe(dto.thumbnail_url);

    // images sort
    expect(vm.images).toHaveLength(2);
    expect(vm.images[0].id).toBe(1);
    expect(vm.images[1].id).toBe(2);

    // mapping
    expect(vm.images[0].isPrimary).toBe(true);
    expect(vm.images[1].isPrimary).toBe(false);

    expect(vm.images[0].width).toBe(1200);
    expect(vm.images[0].height).toBe(800);
    expect(vm.images[0].credit).toBe("seed1");
    expect(vm.images[0].url).toBe("http://localhost/storage/world_heritage/661/img1.jpg");
    expect(vm.images[0].alt).toBe(vm.title);
    expect(vm.images[1].alt).toBe("custom alt 2");
  });

  it("is stable when images is empty array", () => {
    const dto = baseDto({ images: [] });

    const vm = toWorldHeritageDetailVm(dto);

    expect(vm.images).toEqual([]);
    expect(vm.title).toBe(dto.official_name);
  });
});
