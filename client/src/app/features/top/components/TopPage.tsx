import type { ReactNode } from "react";
import { Map } from "./Map.tsx";
import { WorldHeritageBasics } from "./WorldHeritageBasics.tsx";

export default function TopPage({
  hero,
  titleBar,
  header,
  content,
  pagination,
}: {
  hero?: ReactNode;
  titleBar: ReactNode;
  header?: ReactNode;
  content: ReactNode;
  pagination?: ReactNode;
}) {
  return (
    <>
      {hero}
      <main id="heritage-list" className="mx-auto max-w-7xl px-4 py-12">
        {titleBar}

        <div>{header}</div>

        <div className="mt-4">
          <Map />
        </div>

        <WorldHeritageBasics />

        <div className="pt-8">
          {content}
          {pagination}
        </div>
      </main>
    </>
  );
}
