import React from "react";
import { useNavigate } from "react-router-dom";
import { useTopPage } from "../hooks/use-top-page";
import TopPage from "../components/TopPage";

export default function TopPageContainer(): React.ReactElement {
  const { items, reload, isLoading, isError } = useTopPage();
  const navigate = useNavigate();

  const handleClickItem = React.useCallback(
    (id: number) => navigate(`/heritages/${id}`),
    [navigate],
  );

  const handleSearch = React.useCallback(() => {
    console.log("Search is currently disabled.");
  }, []);

  if (isLoading)
    return (
      <main className="p-6">
        <div>Loading…</div>
      </main>
    );
  if (isError)
    return (
      <main className="p-6 space-y-3">
        <div className="text-red-700">Failed to load.</div>
        <button type="button" onClick={reload} className="underline">
          Retry
        </button>
      </main>
    );

  return (
    <TopPage
      items={items}
      onClickItem={handleClickItem}
      onReload={reload}
      onSearch={handleSearch}
    />
  );
}
