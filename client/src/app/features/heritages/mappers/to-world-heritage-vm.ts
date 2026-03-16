import type {
  ApiWorldHeritageDto,
  WorldHeritageVm,
  CriteriaCode,
} from "../../../../domain/types.ts";
import { statePartyLabels } from "@features/constants/state-party-labels.ts";
import { CRITERIA } from "../../../../domain/types.ts";

const ORDER: readonly CriteriaCode[] = CRITERIA;

const isCode = (value: string): value is CriteriaCode =>
  (ORDER as readonly string[]).includes(value);

const normalizeCriteria = (values: readonly (string | CriteriaCode)[]): CriteriaCode[] =>
  Array.from(new Set(values))
    .filter(isCode)
    .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));

const fmtHa = (value: number | null): string =>
  value == null ? "—" : `${Number(value).toLocaleString("en-CA")} ha`;

const titleOf = (data: ApiWorldHeritageDto): string =>
  data.heritage_name_jp || data.official_name || data.name;

const countryLabelOf = (data: ApiWorldHeritageDto): string | null =>
  data.country_name_jp || data.country || null;

const subtitleOf = (data: ApiWorldHeritageDto): string =>
  [countryLabelOf(data), data.region].filter(Boolean).join(" · ");

const toStatePartyLabelsJp = (codes: readonly string[]): string[] =>
  codes.map((code) => statePartyLabels[code]).filter((label): label is string => Boolean(label));

const normalizeStatePartiesMeta = (
  meta: ApiWorldHeritageDto["state_parties_meta"],
): WorldHeritageVm["statePartiesMeta"] => {
  if (Array.isArray(meta)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(meta).map(([key, value]) => [
      key,
      {
        isPrimary: value.is_primary,
        inscriptionYear: value.inscription_year,
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
