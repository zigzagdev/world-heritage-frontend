import { Routes, Route } from "react-router-dom";
import TopPageContainer from "@features/top/containers/top-page-container.tsx";
import { WorldHeritageDetailContainer } from "@features/top/containers/world-heritage-detail-container.tsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TopPageContainer />} />
      <Route path="/heritages/:id" element={<WorldHeritageDetailContainer />} />
    </Routes>
  );
}
