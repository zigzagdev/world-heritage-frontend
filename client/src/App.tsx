import React from "react";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./app/routes/AppRoutes.tsx";

export default function App(): React.ReactElement {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
