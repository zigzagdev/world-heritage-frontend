import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useWorldHeritageDetail } from "../hooks/use-world-heritage-detail";
import { HeritageDetailLayout } from "../components/heritage-detail/HeritageDetailLayout";
import { LOCALES, type Locale } from "../../../../domain/criteria";

function resolveLocale(raw: string | null): Locale {
  if (!raw) return "en";
  return (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : "en";
}

export function WorldHeritageDetailContainer() {
  const [searchParams] = useSearchParams();
  const locale = useMemo(() => resolveLocale(searchParams.get("lang")), [searchParams]);
  const { id } = useParams();
  const { item, isLoading, isError, error, reload } = useWorldHeritageDetail(id);

  if (isLoading) return <p>Loading…</p>;

  if (isError || !item) {
    return (
      <div>
        <p>Failed to load world heritage detail.</p>
        {error instanceof Error && <p>{error.message}</p>}
        <button type="button" onClick={reload}>
          Retry
        </button>
      </div>
    );
  }

  return <HeritageDetailLayout item={item} locale={locale} />;
}
