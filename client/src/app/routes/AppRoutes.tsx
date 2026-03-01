import { Routes, Route } from "react-router-dom";
import TopPageContainer from "@features/top/containers/top-page-container.tsx";
import { WorldHeritageDetailContainer } from "@features/top/containers/world-heritage-detail-container.tsx";
import { SearchHeritageResultsContainer } from "@features/search/containers/search-heritage-result-container.tsx";
import { BreadcrumbProvider } from "@features/breadcrumbs/BreadCrumbProvider.tsx";

export function AppRoutes() {
  return (
    <BreadcrumbProvider>
      <Routes>
        <Route path="/heritages" element={<TopPageContainer />} />
        <Route path="/heritages/:id" element={<WorldHeritageDetailContainer />} />
        <Route path="/heritages/results" element={<SearchHeritageResultsContainer />} />
      </Routes>
    </BreadcrumbProvider>
  );
}
