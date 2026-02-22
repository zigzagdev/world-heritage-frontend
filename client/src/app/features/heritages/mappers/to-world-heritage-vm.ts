import type {
  ApiWorldHeritageDto,
  WorldHeritageVm,
  CriteriaCode,
} from "../../../../domain/types.ts";
import { statePartyLabels } from "@features/constants/state-party-labels.ts";
import { CRITERIA } from "../../../../domain/types.ts";

const ORDER: readonly CriteriaCode[] = CRITERIA;

const isCode = (v: string): v is CriteriaCode => (ORDER as readonly string[]).includes(v);

const normalizeCriteria = (arr: readonly (string | CriteriaCode)[]): CriteriaCode[] =>
  Array.from(new Set(arr))
    .filter(isCode)
    .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));

const fmtHa = (v: number | null) => (v == null ? "—" : `${Number(v).toLocaleString("en-CA")} ha`);

const titleOf = (data: ApiWorldHeritageDto) => data.official_name || data.name;

const subtitleOf = (data: ApiWorldHeritageDto) =>
  [data.country, data.region].filter(Boolean).join(" · ");

const toStatePartyLabelsJp = (codes: readonly string[]): string[] =>
  codes.map((code) => statePartyLabels[code]).filter((label): label is string => Boolean(label));

const normalizeStatePartiesMeta = (
  meta: ApiWorldHeritageDto["state_parties_meta"],
): WorldHeritageVm["statePartiesMeta"] => {
  if (Array.isArray(meta)) return {};

  return Object.fromEntries(
    Object.entries(meta).map(([k, v]) => [
      k,
      {
        isPrimary: v.is_primary,
        inscriptionYear: v.inscription_year,
      },
    ]),
  );
};

export function toWorldHeritageVm(data: ApiWorldHeritageDto): WorldHeritageVm {
  const criteriaCodes = normalizeCriteria(data.criteria);
  const statePartyCodesRaw = data.state_party_codes ?? [];
  const statePartyLabelsJp = toStatePartyLabelsJp(statePartyCodesRaw);

  let stateParty: string | null = data.state_party;

  if (!stateParty && statePartyLabelsJp.length > 0) {
    stateParty = statePartyLabelsJp.join(", ");
  }

  return {
    id: data.id,
    officialName: data.official_name,
    name: data.name,
    heritageNameJp: data.heritage_name_jp,
    country: data.country,
    countryNameJp: data.country_name_jp,
    region: data.region,
    stateParty,

    category: data.category,
    criteria: criteriaCodes,
    yearInscribed: data.year_inscribed,
    areaHectares: data.area_hectares,
    bufferZoneHectares: data.buffer_zone_hectares,
    isEndangered: data.is_endangered,
    latitude: data.latitude,
    longitude: data.longitude,
    shortDescription: data.short_description,
    unescoSiteUrl: data.unesco_site_url,
    statePartyCodes: statePartyLabelsJp,
    statePartiesMeta: normalizeStatePartiesMeta(data.state_parties_meta),
    primaryStatePartyCode: null,

    title: titleOf(data),
    subtitle: subtitleOf(data),
    areaText: fmtHa(data.area_hectares),
    bufferText: fmtHa(data.buffer_zone_hectares),
    criteriaText: criteriaCodes.join(", "),

    thumbnailUrl: data.thumbnail,
    images: [],
  };
}

export const toWorldHeritageListVm = (list: ApiWorldHeritageDto[]): WorldHeritageVm[] =>
  list.map(toWorldHeritageVm);
