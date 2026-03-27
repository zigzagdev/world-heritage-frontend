import { useMemo, useState } from "react";
import { Button } from "@shared/uis/Button";
import SearchIcon from "@mui/icons-material/Search";
import { STUDY_REGIONS, CATEGORIES } from "../../../../../domain/types";
import type { Category, StudyRegion } from "../../../../../domain/types";
import type { SearchValues } from "@features/top/components/HeritageSearchForm.tsx";

type Props = {
  value?: SearchValues;
  onChange?: (next: SearchValues) => void;
  onSubmit?: (query: Partial<SearchValues>) => void;
};

const isStudyRegion = (value: string): value is StudyRegion =>
  STUDY_REGIONS.includes(value as StudyRegion);

const isCategory = (value: string): value is Category => CATEGORIES.includes(value as Category);

export function HeritageSubHeader({ value, onChange, onSubmit }: Props): React.JSX.Element {
  const regionOptions = useMemo(() => ["", ...STUDY_REGIONS] as const, []);
  const categoryOptions = useMemo(() => ["", ...CATEGORIES] as const, []);

  const [internal, setInternal] = useState<SearchValues>({
    region: value?.region ?? "",
    category: value?.category ?? "",
    keyword: value?.keyword ?? "",
    yearInscribedFrom: value?.yearInscribedFrom ?? "",
    yearInscribedTo: value?.yearInscribedTo ?? "",
  });

  const current = value ?? internal;

  const set = (patch: Partial<SearchValues>) => {
    const next: SearchValues = { ...current, ...patch };
    if (!value) setInternal(next);
    onChange?.(next);
  };

  const submit = () => {
    onSubmit?.({
      region: current.region,
      category: current.category,
      keyword: current.keyword,
      yearInscribedFrom: current.yearInscribedFrom,
      yearInscribedTo: current.yearInscribedTo,
    });
  };

  return (
    <div className="border-b border-zinc-200/70 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="divide-y divide-zinc-100 md:divide-y-0 md:flex md:items-stretch">
            {/* Region */}
            <div className="flex items-center gap-3 px-4 py-3 md:border-r md:border-zinc-100 md:w-[160px]">
              <div className="leading-tight shrink-0">
                <div className="text-[11px] font-semibold text-zinc-500">Region</div>
                <div className="text-[10px] text-zinc-400">Area</div>
              </div>
              <select
                value={current.region}
                onChange={(e) => {
                  const v = e.target.value;
                  set({ region: v === "" || isStudyRegion(v) ? v : "" });
                }}
                className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 focus:outline-none"
                aria-label="Region"
              >
                {regionOptions.map((opt, i) => (
                  <option key={`${opt || "all"}-${i}`} value={opt}>
                    {opt || "All"}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3 px-4 py-3 md:border-r md:border-zinc-100 md:w-[160px]">
              <div className="leading-tight shrink-0">
                <div className="text-[11px] font-semibold text-zinc-500">Category</div>
                <div className="text-[10px] text-zinc-400">Type</div>
              </div>
              <select
                value={current.category}
                onChange={(e) => {
                  const v = e.target.value;
                  set({ category: v === "" || isCategory(v) ? v : "" });
                }}
                className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 focus:outline-none"
                aria-label="Category"
              >
                {categoryOptions.map((opt, i) => (
                  <option key={`${opt || "all"}-${i}`} value={opt}>
                    {opt || "All"}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword + Submit */}
            <div className="flex flex-1 items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-zinc-500">Keyword</div>
                <input
                  value={current.keyword}
                  onChange={(e) => set({ keyword: e.target.value })}
                  placeholder="Name / Country"
                  className="w-full bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none"
                  aria-label="Keyword"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="shrink-0 h-9 w-9 rounded-full p-0 !bg-rose-600 !text-white hover:!bg-rose-700
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                aria-label="Search"
                title="Search"
              >
                <SearchIcon fontSize="small" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
