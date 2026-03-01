export interface RouteConfig {
  path: string;
  label: string;
  parent?: string;
  isDynamic?: boolean;
}

export const breadcrumbMap: Record<string, RouteConfig> = {
  "/": { path: "/", label: "Home" },
  "/heritages": { path: "/heritages", label: "World Heritages", parent: "/" },
  "/heritages/:id": { path: "/heritages/:id", label: "", parent: "/heritages", isDynamic: true },
};
