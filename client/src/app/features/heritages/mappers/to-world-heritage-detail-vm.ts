import type {
  ApiWorldHeritageDetailDto,
  ApiWorldHeritageImageDto,
  WorldHeritageDetailVm,
  WorldHeritageImageVm,
  WorldHeritageVm,
} from "../../../../domain/types.ts";
import { toWorldHeritageVm } from "./to-world-heritage-vm.ts";

export function toWorldHeritageDetailVm(dto: ApiWorldHeritageDetailDto): WorldHeritageDetailVm {
  const listDto = {
    id: dto.id,
    official_name: dto.official_name,
    name: dto.name,
    heritage_name_jp: dto.heritage_name_jp,
    country: dto.country,
    country_name_jp: dto.country_name_jp,
    region: dto.region,
    category: dto.category,
    year_inscribed: dto.year_inscribed,
    latitude: dto.latitude,
    longitude: dto.longitude,
    is_endangered: dto.is_endangered,
    criteria: dto.criteria,
    area_hectares: dto.area_hectares,
    buffer_zone_hectares: dto.buffer_zone_hectares,
    short_description: dto.short_description,
    unesco_site_url: dto.unesco_site_url,
    state_party: dto.state_party,
    state_party_codes: dto.state_party_codes,
    state_parties_meta: dto.state_parties_meta,
    thumbnail: dto.thumbnail_url,
  } satisfies import("../../../../domain/types.ts").ApiWorldHeritageDto;

  const base: WorldHeritageVm = toWorldHeritageVm(listDto);

  const images: WorldHeritageImageVm[] = dto.images
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(
      (img: ApiWorldHeritageImageDto): WorldHeritageImageVm => ({
        id: img.id,
        url: img.url,
        alt: img.alt ?? base.title,
        credit: img.credit,
        width: img.width,
        height: img.height,
        isPrimary: img.is_primary,
      }),
    );

  return {
    ...base,
    primaryStatePartyCode: dto.primary_state_party_code,
    images,
  };
}
