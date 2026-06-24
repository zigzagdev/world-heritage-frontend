import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorldHeritageDetail } from "../hooks/use-world-heritage-detail";
import { HeritageGalleryPage } from "../components/heritage-detail/gallery/HeritageGalleryPage";
import { Spinner } from "@shared/uis/Spinner.tsx";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";

export function HeritageGalleryContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) navigate("/heritages", { replace: true });
  }, [id, navigate]);

  const { item, reload, isLoading, isError } = useWorldHeritageDetail(id);

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <ErrorPanel message="Failed to load this site." onRetry={reload} />
      </div>
    );
  }

  if (!item) return null;

  return (
    <HeritageGalleryPage
      title={item.name}
      images={item.images}
      lightboxIndex={lightboxIndex}
      onSelectImage={setLightboxIndex}
      onCloseLightbox={() => setLightboxIndex(null)}
      onNavigateLightbox={setLightboxIndex}
      onBack={() => navigate(`/heritages/${item.id}`)}
    />
  );
}
