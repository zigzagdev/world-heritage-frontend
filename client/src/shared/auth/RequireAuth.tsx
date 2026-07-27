import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner } from "@shared/uis/Spinner.tsx";
import { useAuth } from "./AuthHooks.ts";

export function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}
