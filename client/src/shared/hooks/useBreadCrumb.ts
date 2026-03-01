import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { getBreadcrumbSegments, type BreadcrumbSegment } from "@shared/utils/breadCrumb.ts";

export const useBreadcrumbs = (): BreadcrumbSegment[] => {
  const { pathname } = useLocation();

  // whenever pathname changes, recalculate the breadcrumb segments
  const segments = useMemo(() => {
    return getBreadcrumbSegments(pathname);
  }, [pathname]);

  return segments;
};
