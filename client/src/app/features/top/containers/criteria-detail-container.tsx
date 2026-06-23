import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCriteria,
  isCriteriaCode,
  UNESCO_CRITERIA_SOURCE_URL,
} from "../../../../domain/criteria";
import { useLocale } from "@shared/locale/LocaleHooks";
import { useHeritageSearchQuery } from "@features/search/hooks/use-search-heritage-query";
import { DEFAULT_HERITAGE_SEARCH_PARAMS } from "@features/search/mapper/search-heritage.types";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm";
import { CriteriaDetailPage } from "../components/heritage-detail/criteria/CriteriaDetailPage";
import { Spinner } from "@shared/uis/Spinner.tsx";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";

const EXAMPLE_COUNT = 6;

export function CriteriaDetailContainer() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { locale } = useLocale();

  useEffect(() => {
    if (!code || !isCriteriaCode(code)) navigate("/heritages", { replace: true });
  }, [code, navigate]);

  const validCode = code && isCriteriaCode(code) ? code : null;

  const { data, isLoading, error, refetch } = useHeritageSearchQuery(
    {
      ...DEFAULT_HERITAGE_SEARCH_PARAMS,
      criteria: validCode ? [validCode] : [],
      per_page: EXAMPLE_COUNT,
    },
    { enabled: validCode !== null },
  );

  if (!validCode) return null;

  if (isLoading) return <Spinner />;

  if (error) {
    const message = error instanceof Error ? error.message : "Failed to load example sites.";
    return <ErrorPanel message={message} onRetry={refetch} />;
  }

  const { title, description } = getCriteria(validCode, locale);
  const items = data ? toWorldHeritageListVm(data.items, locale) : [];

  return (
    <CriteriaDetailPage
      code={validCode}
      title={title}
      description={description}
      sourceUrl={`${UNESCO_CRITERIA_SOURCE_URL}#${validCode}`}
      items={items}
      onClickItem={(id) => navigate(`/heritages/${id}`)}
      onViewAllResults={() => navigate(`/heritages/results?criteria=${validCode}`)}
    />
  );
}
