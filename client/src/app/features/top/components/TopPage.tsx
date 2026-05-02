import type { ReactNode } from "react";
import { Map } from "./Map.tsx";

export default function TopPage({
  titleBar,
  header,
  content,
  pagination,
}: {
  titleBar: ReactNode;
  header?: ReactNode;
  content: ReactNode;
  pagination?: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      {titleBar}

      <div>{header}</div>

      <div className="mt-4">
        <Map />
      </div>

      <div className="pt-8">
        {content}
        {pagination}
      </div>
    </main>
  );
}
