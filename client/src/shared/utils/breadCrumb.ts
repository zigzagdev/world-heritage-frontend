import { matchPath } from "react-router-dom";
import { breadcrumbMap } from "@features/constants/route-config.ts";
import type { RouteConfig } from "@shared/types/routes";

export interface BreadcrumbSegment {
  path: string;
  pattern: string;
  label: string;
  isDynamic: boolean; // whether this segment is from a dynamic route
}

export const getBreadcrumbSegments = (pathname: string): BreadcrumbSegment[] => {
  const segments: BreadcrumbSegment[] = [];
  const currentEntry = Object.values(breadcrumbMap).find((route) =>
    matchPath({ path: route.path, end: true }, pathname),
  );

  if (!currentEntry) return [];
  let step: RouteConfig | undefined = currentEntry;

  while (step) {
    const match = matchPath({ path: step.path, end: false }, pathname);

    if (match) {
      segments.unshift({
        path: match.pathname,
        pattern: step.path,
        label: step.label,
        isDynamic: !!step.isDynamic,
      });
    }

    step = step.parent ? breadcrumbMap[step.parent] : undefined;
  }

  return segments;
};
