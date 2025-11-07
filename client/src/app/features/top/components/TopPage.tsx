export type Item = {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  year: number;
  areaText: string;
  bufferText: string;
  thumbnail?: string;
};

export type TopPageProps = {
  items: ReadonlyArray<Item>;
  onReload?: () => void;
  onClickItem?: (id: number) => void;
};

export default function TopPage({ items, onReload, onClickItem }: TopPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          World Heritage
        </h1>

        {onReload && (
          <button
            type="button"
            onClick={onReload}
            aria-label="Reload list"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Reload
          </button>
        )}
      </header>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No sites yet.</p>
      ) : (
        <ul className="m-0 grid list-none p-0 gap-6 md:grid-cols-2 lg:grid-cols-3 [&>li]:m-0 [&>li]:list-none">
          {items.map((it) => (
            <li
              key={it.id}
              className="group list-none overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 shadow-sm backdrop-blur transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <button
                type="button"
                onClick={() => onClickItem?.(it.id)}
                className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {/* Thumbnail */}
                {it.thumbnail ? (
                  <img
                    src={it.thumbnail}
                    alt={it.title}
                    loading="lazy"
                    className="h-40 w-full object-cover sm:h-44 lg:h-48"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    No image
                  </div>
                )}

                {/* Body */}
                <div className="space-y-2 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {it.title}
                      </div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{it.subtitle}</div>
                    </div>

                    <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {it.category}
                    </span>
                  </div>

                  <div className="text-sm text-zinc-600 dark:text-zinc-300">
                    Year: <span className="tabular-nums">{it.year}</span>
                  </div>

                  <div className="text-sm text-zinc-600 dark:text-zinc-300">
                    Area: {it.areaText} <span className="px-1 text-zinc-400">/</span> Buffer:{" "}
                    {it.bufferText}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="h-16">llll</div>
    </main>
  );
}
