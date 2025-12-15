import {
  getCriteria,
  isCriteriaCode,
  UNESCO_CRITERIA_SOURCE_URL,
  type CriteriaCode,
  type Locale,
} from "../../domain/criteria";

type Props = {
  criteria: readonly (CriteriaCode | string)[];
  locale: Locale;
};

export function CriteriaTags({ criteria, locale }: Props) {
  const safeCriteria = criteria
    .map((criterion) => String(criterion).trim().toLowerCase())
    .filter((criterion): criterion is CriteriaCode => isCriteriaCode(criterion));

  if (safeCriteria.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {safeCriteria.map((code) => {
        const { title, description } = getCriteria(code, locale);
        const href = `${UNESCO_CRITERIA_SOURCE_URL}#${code}`;

        return (
          <li key={code}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title={description ? `${title} — ${description}` : title}
              className="inline-flex items-center rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
            >
              <span className="font-medium">{title || code}</span>
              <span className="ml-1 opacity-70">({code})</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
