import { lazy, Suspense, type ReactNode } from "react";

const Map = lazy(() => import("./Map.tsx").then((m) => ({ default: m.Map })));

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
          <Suspense fallback={<div className="h-[400px] animate-pulse rounded-xl bg-zinc-100" />}>
            <Map />
          </Suspense>
        </div>

        <div className="pt-8">
          {content}
          {pagination}
        </div>
      </main>
    </>
  );
}
