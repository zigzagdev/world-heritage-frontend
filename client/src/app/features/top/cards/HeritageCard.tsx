import type { WorldHeritageVm } from "../../../../domain/types.ts";
import { BaseCard } from "@shared/uis/BaseCard.tsx";
import { useText } from "@shared/locale/ui-text.ts";

export function HeritageCard({
  item,
  onClickItem,
}: {
  item: WorldHeritageVm;
  onClickItem?: (id: number) => void;
}) {
  const text = useText();

  const handleCardClick = () => {
    if (onClickItem) onClickItem(item.id);
  };

  const title = item.title;

  return (
    <BaseCard onClick={handleCardClick}>
      <div className="relative h-64 overflow-hidden rounded-2xl sm:h-72 lg:h-80">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-zinc-100 dark:from-indigo-950 dark:to-zinc-800">
            <div className="flex flex-col items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-14 w-14 text-indigo-200 dark:text-indigo-800"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="line-clamp-2 px-4 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
                {title}
              </span>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {item.isEndangered && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
              {text.danger}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-white break-words">
            {title}
          </h3>
          <p className="mt-1 text-sm text-white/70">
            {item.country} · {item.yearInscribed}
          </p>
        </div>
      </div>
    </BaseCard>
  );
}
