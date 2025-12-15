import {
  getCriteria,
  isCriteriaCode,
  UNESCO_CRITERIA_SOURCE_URL,
  type CriteriaCode,
  type Locale,
} from "../../domain/criteria";

type Props = {
  criteria: Array<CriteriaCode | string>;
  locale: Locale;
};

export function CriteriaTags({ criteria, locale }: Props) {
  const safeCriteria = criteria.filter((c): c is CriteriaCode =>
    typeof c === "string" ? isCriteriaCode(c) : false,
  );

  return (
    <ul className="flex flex-wrap gap-2">
      {safeCriteria.map((code) => {
        const { title, description } = getCriteria(code, locale);

        return (
          <li
            key={code}
            title={`${title} — ${description}`}
            className="rounded bg-gray-200 px-2 py-1 text-sm"
          >
            <span className="font-medium">{title}</span>
            <span className="ml-1 opacity-70">({code})</span>
          </li>
        );
      })}

      <li className="text-sm underline">
        <a href={UNESCO_CRITERIA_SOURCE_URL} target="_blank" rel="noreferrer">
          {locale === "ja" ? "定義" : "Definitions"}
        </a>
      </li>
    </ul>
  );
}
