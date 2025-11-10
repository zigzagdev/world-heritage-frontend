import type { ApiWorldHeritageDto, WorldHeritageVm, CriteriaCode } from "../types";
import { statePartyLabels } from "@features/constants/state-party-labels";

const ORDER: CriteriaCode[] = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

const isCode = (v: string): v is CriteriaCode => (ORDER as readonly string[]).includes(v);

const normalize = (arr: readonly string[]): CriteriaCode[] =>
  Array.from(new Set(arr))
    .filter(isCode)
    .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));

const fmtHa = (v: number | null) => (v == null ? "—" : `${Number(v).toLocaleString("en-CA")} ha`);

const titleOf = (data: ApiWorldHeritageDto) => data.official_name || data.name;

const subtitleOf = (data: ApiWorldHeritageDto) =>
  [data.country, data.region].filter(Boolean).join(" · ");

const toStatePartyLabelsJp = (codes: readonly string[]): string[] =>
  codes.map((code) => statePartyLabels[code]).filter((label): label is string => Boolean(label));

export function toWorldHeritageVm(data: ApiWorldHeritageDto): WorldHeritageVm {
  const codes = normalize(data.criteria);
  const statePartyCodes = data.state_party_codes ?? [];

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
    statePartyCodes: toStatePartyLabelsJp(statePartyCodes),
    statePartiesMeta: Object.fromEntries(
      Object.entries(data.state_parties_meta).map(([k, v]) => [
        k,
        {
          isPrimary: v.is_primary,
          inscriptionYear: v.inscription_year,
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

export const toWorldHeritageListVm = (list: ApiWorldHeritageDto[]) => list.map(toWorldHeritageVm);
