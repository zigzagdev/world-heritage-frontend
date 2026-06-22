import {
  type ApiWorldHeritageDto,
  type WorldHeritageVm,
  type CriteriaCode,
} from "../../../../domain/types.ts";
import type { Locale } from "../../../../domain/criteria.ts";
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

const titleOf = (data: ApiWorldHeritageDto, locale: Locale): string =>
  locale === "ja"
    ? data.heritage_name_jp || data.official_name || data.name
    : data.name || data.official_name || data.heritage_name_jp;

const countryLabelOf = (data: ApiWorldHeritageDto, locale: Locale): string | null =>
  locale === "ja"
    ? data.country_name_jp || data.country || null
    : data.country || data.country_name_jp || null;

const subtitleOf = (data: ApiWorldHeritageDto, locale: Locale): string =>
  [countryLabelOf(data, locale), data.region].filter(Boolean).join(" · ");

// ja の時だけ、日本語名の脇に併記する英名を返す（一致や不在なら null）
const subNameOf = (data: ApiWorldHeritageDto, locale: Locale): string | null => {
  if (locale !== "ja") return null;
  if (!data.heritage_name_jp || !data.name) return null;
  if (data.heritage_name_jp === data.name) return null;
  return data.name;
};

const descriptionOf = (data: ApiWorldHeritageDto, locale: Locale): string => {
  if (locale === "ja") {
    return data.short_description_jp || data.short_description || "";
  }
  return data.short_description || "";
};

const toStatePartyLabels = (codes: readonly string[], locale: Locale): string[] => {
  if (locale !== "ja") {
    return [...codes];
  }

  return codes
    .map((code) => statePartyLabels[code])
    .filter((label): label is string => Boolean(label));
};

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

export function toWorldHeritageVm(data: ApiWorldHeritageDto, locale: Locale): WorldHeritageVm {
  const criteriaCodes = normalizeCriteria(data.criteria);
  const statePartyCodesRaw = data.state_party_codes ?? [];
  const statePartyLabelsLocalized = toStatePartyLabels(statePartyCodesRaw, locale);

  let stateParty: string | null = data.state_party;

  if (!stateParty && statePartyLabelsLocalized.length > 0) {
    stateParty = statePartyLabelsLocalized.join(", ");
  }

  return {
    id: data.id,
    officialName: data.official_name,
    name: data.name,
    heritageNameJp: data.heritage_name_jp,

    country: countryLabelOf(data, locale) ?? "",
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
    shortDescriptionJp: data.short_description_jp,
    unescoSiteUrl: data.unesco_site_url,
    statePartyCodes: statePartyLabelsLocalized,
    statePartiesMeta: normalizeStatePartiesMeta(data.state_parties_meta),
    primaryStatePartyCode: null,

    title: titleOf(data, locale),
    subtitle: subtitleOf(data, locale),
    displaySubName: subNameOf(data, locale),
    displayDescription: descriptionOf(data, locale),
    areaText: fmtHa(data.area_hectares),
    bufferText: fmtHa(data.buffer_zone_hectares),
    criteriaText: criteriaCodes.join(", "),

    thumbnailUrl: data.thumbnail_url,
    images: [],
  };
}

export const toWorldHeritageListVm = (
  list: ApiWorldHeritageDto[],
  locale: Locale,
): WorldHeritageVm[] => list.map((data) => toWorldHeritageVm(data, locale));
