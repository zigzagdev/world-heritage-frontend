import { HeritageSearchForm, type SearchValues } from "./HeritageSearchForm";

export type Props = {
  value: SearchValues;
  onSubmit: (q: Partial<SearchValues>) => void;
  onChange?: (v: SearchValues) => void;
};

export function HeritageSubHeader({ value, onSubmit, onChange }: Props) {
  return (
    <div className="sticky top-0 z-30 border-zinc-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-[1000px]">
            <HeritageSearchForm
              value={value}
              expandKeywordOnFocus
              onChange={onChange}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
