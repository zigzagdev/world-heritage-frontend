import { Routes, Route } from "react-router-dom";
import TopPageContainer from "@features/top/containers/top-page-container.tsx";
import { WorldHeritageDetailContainer } from "@features/top/containers/world-heritage-detail-container.tsx";
import { SearchHeritageContainer } from "@features/top/containers/search-heritage-container.tsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TopPageContainer />} />
      <Route path="/heritages/:id" element={<WorldHeritageDetailContainer />} />
      <Route path="/heritages/search" element={<SearchHeritageContainer />} />
    </Routes>
  );
}
