import React, { createContext, useState, useCallback, ReactNode } from "react";
import type { BreadcrumbContextType, BreadcrumbMap } from "../../../domain/types.ts";

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [labels, setLabels] = useState<BreadcrumbMap>({});

  const setLabel = useCallback((path: string, label: string) => {
    setLabels((prev) => ({ ...prev, [path]: label }));
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ labels, setLabel }}>{children}</BreadcrumbContext.Provider>
  );
};

export default BreadcrumbContext;
