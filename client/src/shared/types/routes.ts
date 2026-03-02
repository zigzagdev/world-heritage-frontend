export interface RouteConfig {
  path: string;
  label: string;
  parent?: string | null;
  isDynamic?: boolean; // flag to indicate if the route has dynamic segments
}

// config/breadcrumbMap.ts
export const breadcrumbMap: Record<string, RouteConfig> = {
  "/": {
    path: "/heritages",
    label: "Top",
  },
  "/heritages/:id": {
    path: "/heritages/:id",
    label: "", // default is empty cause it will be replaced by the heritage name
    parent: "/heritages",
    isDynamic: true,
  },
  "/heritages/results": {
    path: "/heritages/results",
    label: "Search Results",
    parent: "/heritages",
    isDynamic: false,
  },
};
