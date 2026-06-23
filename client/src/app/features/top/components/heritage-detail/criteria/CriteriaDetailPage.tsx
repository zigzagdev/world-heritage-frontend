import type { WorldHeritageVm } from "../../../../../../domain/types.ts";
import { CriteriaExampleCard } from "./CriteriaExampleCard";
import { useText } from "@shared/locale/ui-text.ts";

export function CriteriaDetailPage({
  code,
  title,
  description,
  sourceUrl,
  items,
  onClickItem,
  onViewAllResults,
}: {
  code: string;
  title: string;
  description: string;
  sourceUrl: string;
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem: (id: number) => void;
  onViewAllResults: () => void;
}) {
  const text = useText();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          {text.criteria} ({code})
        </p>
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        <p className="mt-3 max-w-2xl text-zinc-700">{description}</p>
        <a
          href={sourceUrl}
          referrerPolicy="no-referrer"
          className="mt-2 inline-block text-sm text-blue-600 hover:underline"
        >
          {text.unescoCriteriaSource}
        </a>
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">{text.exampleSites}</h2>
          <button onClick={onViewAllResults} className="text-sm text-blue-600 hover:underline">
            {text.viewAllResults}
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-zinc-600">{text.noSitesFound}</p>
        ) : (
          <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <CriteriaExampleCard key={item.id} item={item} onClickItem={onClickItem} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
