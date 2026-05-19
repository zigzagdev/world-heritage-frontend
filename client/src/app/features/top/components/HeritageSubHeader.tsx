import { HeritageSearchForm } from "./HeritageSearchForm";
import { type SearchValues } from "../../../../domain/types.ts";

type Props = {
  value: SearchValues;
  onSubmit: (q: Partial<SearchValues>) => void;
  onChange?: (v: SearchValues) => void;
  onClose?: () => void;
};

export function HeritageSubHeader({ value, onSubmit, onChange, onClose }: Props) {
  return (
    <div className="z-30 border-zinc-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-[1000px]">
            <HeritageSearchForm value={value} onChange={onChange} onSubmit={onSubmit} />
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="self-start rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 md:self-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
