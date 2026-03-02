import { useContext } from "react";
import BreadcrumbContext from "./BreadCrumbProvider.tsx";

// label を登録する
export const useSetBreadcrumbLabel = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) throw new Error("useSetBreadcrumbLabel must be used within BreadcrumbProvider");
  return context.setLabel;
};

// 全ラベルを取得する
export const useBreadcrumbLabels = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) throw new Error("useBreadcrumbLabels must be used within BreadcrumbProvider");
  return context.labels;
};
