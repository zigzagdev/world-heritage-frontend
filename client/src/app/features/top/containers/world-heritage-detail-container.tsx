import { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorldHeritageDetail } from "../hooks/use-world-heritage-detail";
import { HeritageDetailLayout } from "../components/heritage-detail/HeritageDetailLayout";
import BreadcrumbContext from "@features/breadcrumbs/BreadCrumbProvider";
import { Spinner } from "@shared/uis/Spinner.tsx";

export function WorldHeritageDetailContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  if (isLoading) return <Spinner />;

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

  return <HeritageDetailLayout item={item} />;
}
