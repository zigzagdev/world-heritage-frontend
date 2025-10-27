import type { WorldHeritageDto, WorldHeritageVm, CriteriaCode } from "../types";

const ORDER: CriteriaCode[] = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

const fmtHa = (v: number | null) => (v == null ? "—" : `${Number(v).toLocaleString("en-CA")} ha`);

const titleOf = (d: WorldHeritageDto) => d.official_name || d.name;
const subtitleOf = (d: WorldHeritageDto) => [d.country, d.region].filter(Boolean).join(" · ");

const normalizeCriteria = (arr: readonly CriteriaCode[]): CriteriaCode[] =>
  Array.from(new Set(arr)).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));

export function toWorldHeritageVm(data: WorldHeritageDto): WorldHeritageVm {
  const codes = normalizeCriteria(data.criteria);
  return {
    id: data.id,
    officialName: data.official_name,
    name: data.name,
    nameJp: data.name_jp,
    country: data.country,
    region: data.region,
    stateParty: data.state_party,
    category: data.category,
    criteria: codes,
    yearInscribed: data.year_inscribed,
    areaHectares: data.area_hectares,
    bufferZoneHectares: data.buffer_zone_hectares,
    isEndangered: data.is_endangered,
    latitude: data.latitude,
    longitude: data.longitude,
    shortDescription: data.short_description,
    unescoSiteUrl: data.unesco_site_url,
    statePartyCodes: data.state_party_codes,
    statePartiesMeta: Object.fromEntries(
      Object.entries(data.state_parties_meta).map(([key, value]) => [
        key,
        {
          isPrimary: value.is_primary,
          inscriptionYear: value.inscription_year,
        },
      ]),
    ),
    thumbnail: data.thumbnail ?? undefined,
    title: titleOf(data),
    subtitle: subtitleOf(data),
    areaText: fmtHa(data.area_hectares),
    bufferText: fmtHa(data.buffer_zone_hectares),
    criteriaText: codes.join(", "),
  };
}

export const toWorldHeritageListVm = (list: WorldHeritageDto[]) => list.map(toWorldHeritageVm);
