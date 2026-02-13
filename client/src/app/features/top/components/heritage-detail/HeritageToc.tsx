const toc = [
  { label: "Overview", id: "overview" },
  { label: "Map", id: "geo-map" },
  { label: "Gallery", id: "gallery" },
  { label: "WorldHeritage Data", id: "heritage-data" },
] as const;

export function HeritageToc() {
  return (
    <nav
      aria-label="On this page"
      className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4">
        <div className="text-sm font-extrabold tracking-wide text-zinc-900">On this page</div>
      </div>
      <div className="hidden lg:block border-t border-zinc-100 p-3">
        <ul className="space-y-1">
          {toc.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:hidden border-t border-zinc-100 p-3">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
          {toc.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              {t.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
