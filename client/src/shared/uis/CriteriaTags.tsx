import { Link } from "react-router-dom";
import { getCriteria, isCriteriaCode, type Locale } from "../../domain/criteria";
import type { CriteriaCode } from "../../domain/types.ts";

export function CriteriaTags({
  criteria,
  locale,
}: {
  criteria: readonly (CriteriaCode | string)[];
  locale: Locale;
}) {
  const safeCriteria = criteria
    .map((criterion) => String(criterion).trim().toLowerCase())
    .filter((criterion): criterion is CriteriaCode => isCriteriaCode(criterion));

  if (safeCriteria.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {safeCriteria.map((code) => {
        const { title, description } = getCriteria(code, locale);

        return (
          <li key={code}>
            <Link
              to={`/heritages/criteria/${code}`}
              title={description ? `${title} — ${description}` : title}
              className="inline-flex items-center rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
            >
              <span className="font-medium">{title || code}</span>
              <span className="ml-1 opacity-70">({code})</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
