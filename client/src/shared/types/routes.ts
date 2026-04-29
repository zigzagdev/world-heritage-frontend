export interface RouteConfig {
  path: string;
  label: string;
  parent?: string | null;
  isDynamic?: boolean; // flag to indicate if the route has dynamic segments
}
