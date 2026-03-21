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

function Divider() {
  return <div className="hidden h-8 w-px bg-zinc-200 md:block" aria-hidden="true" />;
}

function FieldLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="min-w-[84px] leading-tight">
      <div className="text-[11px] font-semibold text-zinc-600">{title}</div>
      <div className="text-[11px] text-zinc-400">{subtitle}</div>
    </div>
  );
}

const isStudyRegion = (value: string): value is StudyRegion => {
  return STUDY_REGIONS.includes(value as StudyRegion);
};

const isCategory = (value: string): value is Category => {
  return CATEGORIES.includes(value as Category);
};

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
    <div className="sticky top-0 z-30 border-zinc-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-[1000px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="flex items-center gap-3 md:w-[180px]">
                  <FieldLabel title="Region" subtitle="Area" />
                  <select
                    value={current.region}
                    onChange={(e) => {
                      const v = e.target.value;
                      set({ region: v === "" || isStudyRegion(v) ? v : "" });
                    }}
                    className="h-10 w-full rounded-xl bg-transparent px-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus:outline-none"
                    aria-label="Region"
                  >
                    {regionOptions.map((opt, i) => (
                      <option key={`${opt || "all"}-${i}`} value={opt}>
                        {opt || "All"}
                      </option>
                    ))}
                  </select>
                </div>

                <Divider />

                <div className="flex items-center gap-3 md:w-[220px]">
                  <FieldLabel title="Category" subtitle="Type" />
                  <select
                    value={current.category}
                    onChange={(e) => {
                      const v = e.target.value;
                      set({ category: v === "" || isCategory(v) ? v : "" });
                    }}
                    className="h-10 w-full rounded-xl bg-transparent px-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus:outline-none"
                    aria-label="Category"
                  >
                    {categoryOptions.map((opt, i) => (
                      <option key={`${opt || "all"}-${i}`} value={opt}>
                        {opt || "All"}
                      </option>
                    ))}
                  </select>
                </div>

                <Divider />

                <div className="flex items-center gap-3 md:flex-1">
                  <FieldLabel title="Keyword" subtitle="Name / Country" />
                  <input
                    value={current.keyword}
                    onChange={(e) => set({ keyword: e.target.value })}
                    placeholder="Search the List"
                    className="h-10 w-full rounded-xl bg-transparent px-2 text-sm text-zinc-900 placeholder:text-zinc-400 hover:bg-zinc-50 focus:outline-none"
                    aria-label="Keyword"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 w-10 shrink-0 rounded-full p-0 !bg-rose-600 !text-white hover:!bg-rose-700
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400
                               focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
      </div>
    </div>
  );
}
