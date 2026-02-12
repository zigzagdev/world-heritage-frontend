import type { ApiWorldHeritageDto, WorldHeritageVm, CriteriaCode } from "../types";
import { statePartyLabels } from "@features/constants/state-party-labels";
import { CRITERIA } from "../types";

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
  if (Array.isArray(meta)) {
    return {};
  }

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
  const thumbnailData = data.thumbnail ?? data.image_url ?? null;

  let stateParty: string | null = data.state_party;

  if (!stateParty && statePartyLabelsJp.length > 0) {
    stateParty = statePartyLabelsJp.join(", ");
  }
  return {
    id: data.id,
    officialName: data.official_name,
    name: data.name,
    nameJp: data.name_jp,
    country: data.country,
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
    primaryStatePartyCode: data.primary_state_party_code ?? null,
    title: titleOf(data),
    subtitle: subtitleOf(data),
    areaText: fmtHa(data.area_hectares),
    bufferText: fmtHa(data.buffer_zone_hectares),
    criteriaText: criteriaCodes.join(", "),
    thumbnail: thumbnailData
      ? {
          id: thumbnailData.id,
          url: thumbnailData.url,
          alt: thumbnailData.alt ?? titleOf(data),
          credit: thumbnailData.credit,
          width: thumbnailData.width,
          height: thumbnailData.height,
          isPrimary: thumbnailData.is_primary,
        }
      : null,
  };
}

export const toWorldHeritageListVm = (list: ApiWorldHeritageDto[]): WorldHeritageVm[] =>
  list.map(toWorldHeritageVm);
