export interface RouteConfig {
  path: string;
  label: string;
  parent?: string;
  isDynamic?: boolean; // flag to indicate if the route has dynamic segments
}

// config/breadcrumbMap.ts
export const breadcrumbMap: Record<string, RouteConfig> = {
  "/": {
    path: "/",
    label: "Home",
  },
  "/heritages": {
    path: "/heritages",
    label: "World Heritages",
    parent: "/",
  },
  "/heritages/:id": {
    path: "/heritages/:id",
    label: "", // default is empty cause it will be replaced by the heritage name
    parent: "/heritages",
    isDynamic: true,
  },
  "/heritages/:id/edit": {
    path: "/heritages/:id/edit",
    label: "Edit",
    parent: "/heritages/:id",
  },
};
