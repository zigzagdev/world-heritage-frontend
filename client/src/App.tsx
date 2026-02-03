import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app/routes/AppRoutes.tsx";

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
