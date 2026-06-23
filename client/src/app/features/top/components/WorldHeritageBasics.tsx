import { Link } from "react-router-dom";
import { CRITERIA_CODES, getCriteria } from "../../../../domain/criteria";
import { useLocale } from "@shared/locale/LocaleHooks.ts";
import { useText } from "@shared/locale/ui-text.ts";

export function WorldHeritageBasics() {
  const { locale } = useLocale();
  const text = useText();

  return (
    <section aria-label={text.worldHeritageBasics} className="mt-8">
      <h2 className="text-lg font-semibold text-zinc-900">{text.worldHeritageBasics}</h2>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">{text.worldHeritageBasicsDescription}</p>

      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {CRITERIA_CODES.map((code) => {
          const { title } = getCriteria(code, locale);

          return (
            <li key={code}>
              <Link
                to={`/heritages/criteria/${code}`}
                className="flex h-full items-center gap-2 rounded bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300"
              >
                <span className="inline-block w-12 shrink-0 font-mono text-xs opacity-70">
                  ({code})
                </span>
                <span className="font-medium">{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
