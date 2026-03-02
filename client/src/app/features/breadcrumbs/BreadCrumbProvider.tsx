import React, { createContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { BreadcrumbContextType, BreadcrumbMap } from "../../../domain/types.ts";

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [labels, setLabels] = useState<BreadcrumbMap>({});

  const setLabel = useCallback((path: string, label: string) => {
    setLabels((prev) => {
      if (prev[path] === label) return prev;
      return { ...prev, [path]: label };
    });
  }, []);

  const value = useMemo(() => ({ labels, setLabel }), [labels, setLabel]);

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>;
};

export default BreadcrumbContext;
