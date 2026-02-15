import { describe, it, expect } from "vitest";
import { toWorldHeritageDetailVm } from "../to-world-heritage-detail-vm.ts";
import type {
  ApiWorldHeritageDto,
  ApiWorldHeritageImageDto,
  WorldHeritageDetailVm,
} from "../../../../../domain/types.ts";

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

const baseDto: ApiWorldHeritageDto = {
  id: 661,
  official_name: "Himeji-jo Official",
  name: "Himeji-jo",
  name_jp: "姫路城",
  country: "Japan",
  region: "Asia",
  state_party: null,
  category: "Cultural",
  criteria: ["i", "iv"],
  year_inscribed: 1993,
  area_hectares: 107,
  buffer_zone_hectares: 143,
  is_endangered: false,
  latitude: 34.8394,
  longitude: 134.6939,
  short_description: "dummy",
  unesco_site_url: "https://example.com",
  state_party_codes: ["JPN"],
  state_parties_meta: {
    JPN: {
      is_primary: true,
      inscription_year: 1993,
    },
  },
  primary_state_party_code: "JPN",
  image_url: image,
  images: [],
};

describe("toWorldHeritageDetailVm", () => {
  it("maps base fields via toWorldHeritageVm and attaches sorted image VMs", () => {
    const images: ApiWorldHeritageImageDto[] = [
      {
        id: 2,
        url: "http://localhost/storage/world_heritage/661/img2.jpg",
        sort_order: 2,
        width: 1200,
        height: 800,
        format: "jpg",
        alt: "custom alt 2",
        credit: "seed2",
        is_primary: false,
        checksum: "dummy2",
      },
      {
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
      },
    ];

    const dto: ApiWorldHeritageDto = {
      ...baseDto,
      images,
    };

    const vm: WorldHeritageDetailVm = toWorldHeritageDetailVm(dto);

    expect(vm.id).toBe(dto.id);
    expect(vm.title).toBe(dto.official_name);
    expect(vm.country).toBe(dto.country);
    expect(vm.region).toBe(dto.region);

    // images が sort_order 昇順でソートされていること
    expect(vm.images).toHaveLength(2);
    expect(vm.images[0].id).toBe(1);
    expect(vm.images[1].id).toBe(2);

    // isPrimary のマッピング
    expect(vm.images[0].isPrimary).toBe(true);
    expect(vm.images[1].isPrimary).toBe(false);

    // width / height / credit / url のマッピング
    expect(vm.images[0].width).toBe(1200);
    expect(vm.images[0].height).toBe(800);
    expect(vm.images[0].credit).toBe("seed1");
    expect(vm.images[0].url).toBe("http://localhost/storage/world_heritage/661/img1.jpg");
    expect(vm.images[0].alt).toBe(vm.title);
    expect(vm.images[1].alt).toBe("custom alt 2");
  });

  it("returns empty images array when dto.images is undefined", () => {
    const dto: ApiWorldHeritageDto = {
      ...baseDto,
      images: undefined as never,
    };

    const vm = toWorldHeritageDetailVm(dto);

    expect(vm.images).toEqual([]);
  });

  it("is stable when images is empty array", () => {
    const dto: ApiWorldHeritageDto = {
      ...baseDto,
      images: [],
    };

    const vm = toWorldHeritageDetailVm(dto);

    expect(vm.images).toEqual([]);
    expect(vm.title).toBe(baseDto.official_name);
  });
});
