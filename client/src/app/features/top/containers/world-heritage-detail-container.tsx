import { useEffect, useMemo, useContext } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useWorldHeritageDetail } from "../hooks/use-world-heritage-detail";
import { HeritageDetailLayout } from "../components/heritage-detail/HeritageDetailLayout";
import { LOCALES, type Locale } from "../../../../domain/criteria";
import BreadcrumbContext from "@features/breadcrumbs/BreadCrumbProvider";

function resolveLocale(raw: string | null): Locale {
  if (!raw) return "en";
  return (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : "en";
}

export function WorldHeritageDetailContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useMemo(() => resolveLocale(searchParams.get("lang")), [searchParams]);

  useEffect(() => {
    if (!id) navigate("/heritages", { replace: true });
  }, [id, navigate]);

  const { item, isLoading, isError } = useWorldHeritageDetail(id);
  const breadcrumbCtx = useContext(BreadcrumbContext);
  if (!breadcrumbCtx) throw new Error("BreadcrumbProvider is missing");

  const { setLabel } = breadcrumbCtx;

  useEffect(() => {
    const label = isLoading ? "Loading…" : isError ? "Failed to load" : (item?.name ?? "Details");
    setLabel("/heritages/:id", label);
  }, [setLabel, isLoading, isError, item?.name]);

  if (isLoading) return <p>Loading…</p>;

  if (isError) {
    return (
      <div>
        <p>Failed to load.</p>
        <button onClick={() => navigate("/heritages")}>Back to World Heritages</button>
      </div>
    );
  }

  if (!item) {
    return (
      <div>
        <p>Not found.</p>
        <button onClick={() => navigate("/heritages")}>Back to World Heritages</button>
      </div>
    );
  }

  return <HeritageDetailLayout item={item} locale={locale} />;
}
