import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader.tsx";
import { AppFooter } from "./AppFooter.tsx";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex-1">{children}</div>
      <AppFooter />
    </div>
  );
}
