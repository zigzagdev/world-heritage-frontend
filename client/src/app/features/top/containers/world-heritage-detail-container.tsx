import { useParams } from "react-router-dom";
import { useWorldHeritageDetail } from "../hooks/use-world-heritage-detail";
import { HeritageDetailLayout } from "../components/HeritageDetailLayout";

export function WorldHeritageDetailContainer() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? null;
  const { item, isLoading, isError, error, reload } = useWorldHeritageDetail(id);

  if (!id) {
    return <p>World Heritage id is required.</p>;
  }

  if (isLoading) {
    return <p>Loading…</p>;
  }

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

  return <HeritageDetailLayout item={item} />;
}
