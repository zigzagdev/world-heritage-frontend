import type { RouteConfig } from "@shared/types/routes";

export const breadcrumbMap: Record<string, RouteConfig> = {
  "/heritages": {
    path: "/heritages",
    label: "Index",
    parent: null,
    isDynamic: false,
  },
  "/heritages/results": {
    path: "/heritages/results",
    label: "Search Results",
    parent: "/heritages",
    isDynamic: false,
  },
  "/heritages/:id": {
    path: "/heritages/:id",
    label: "",
    parent: "/heritages",
    isDynamic: true,
  },
};
