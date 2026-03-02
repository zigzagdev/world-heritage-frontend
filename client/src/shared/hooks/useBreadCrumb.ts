import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { getBreadcrumbSegments, type BreadcrumbSegment } from "@shared/utils/breadCrumb.ts";

export const useBreadcrumbs = (dynamicLabels?: Record<string, string>): BreadcrumbSegment[] => {
  const { pathname } = useLocation();

  // whenever pathname changes, recalculate the breadcrumb segments
  return useMemo(() => {
    return getBreadcrumbSegments(pathname, dynamicLabels);
  }, [pathname, dynamicLabels]);
};
