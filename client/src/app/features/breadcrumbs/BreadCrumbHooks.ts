import { useContext } from "react";
import BreadcrumbContext from "./BreadCrumbProvider.tsx";

// register labeling
export const useSetBreadcrumbLabel = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) throw new Error("useSetBreadcrumbLabel must be used within BreadcrumbProvider");
  return context.setLabel;
};

// fetching all labels
export const useBreadcrumbLabels = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) throw new Error("useBreadcrumbLabels must be used within BreadcrumbProvider");
  return context.labels;
};
