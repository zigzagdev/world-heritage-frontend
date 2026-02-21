import { useMemo, useState } from "react";
import { Button } from "@shared/uis/Button.tsx";
import SearchIcon from "@mui/icons-material/Search";

type SearchValues = {
  region: string;
  category: string;
  keyword: string;
};

type Props = {
  value?: SearchValues;
  onChange?: (next: SearchValues) => void;
  onSubmit?: (next: { region?: string; category?: string; keyword?: string }) => void;
  expandKeywordOnFocus?: boolean;
};

function Divider({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className={`${hidden ? "hidden" : "hidden md:block"} h-8 w-px bg-zinc-200`}
      aria-hidden="true"
    />
  );
}

function FieldLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="min-w-[84px] leading-tight">
      <div className="text-[11px] font-semibold text-zinc-600">{title}</div>
      <div className="text-[11px] text-zinc-400">{subtitle}</div>
    </div>
  );
}

export function HeritageSearchForm({
  value,
  onChange,
  onSubmit,
  expandKeywordOnFocus = true,
}: Props) {
  const regionOptions = useMemo(() => ["", "AFR", "ARB", "APA", "EUR", "LAC"] as const, []);
  const categoryOptions = useMemo(() => ["", "Cultural", "Natural", "Mixed"] as const, []);
  const [internal, setInternal] = useState<SearchValues>({
    region: value?.region ?? "",
    category: value?.category ?? "",
    keyword: value?.keyword ?? "",
  });

  const v = value ?? internal;

  const set = (patch: Partial<SearchValues>) => {
    const next: SearchValues = { ...v, ...patch };
    console.log("form set()", { patch, v, next, hasValueProp: !!value });
    if (!value) setInternal(next);
    onChange?.(next);
  };

  const submit = () => {
    onSubmit?.({
      region: v.region || undefined,
      category: v.category || undefined,
      keyword: v.keyword.trim() || undefined,
    });
  };

  const [keywordFocused, setKeywordFocused] = useState(false);
  const compactKeywordOnly = expandKeywordOnFocus && keywordFocused;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="
        rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm
        focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300
      "
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div
          className={`${compactKeywordOnly ? "hidden" : "flex"} items-center gap-3 md:flex md:w-[180px]`}
        >
          <FieldLabel title="Region" subtitle="Area" />
          <select
            value={v.region}
            onChange={(e) => set({ region: e.target.value })}
            className="h-10 w-full rounded-xl bg-transparent px-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus:outline-none"
            aria-label="Region"
          >
            {regionOptions.map((opt, i) => (
              <option key={`${opt || "all"}-${i}`} value={opt}>
                {opt ? opt : "All"}
              </option>
            ))}
          </select>
        </div>

        <Divider hidden={compactKeywordOnly} />

        <div
          className={`${compactKeywordOnly ? "hidden" : "flex"} items-center gap-3 md:flex md:w-[220px]`}
        >
          <FieldLabel title="Category" subtitle="Type" />
          <select
            value={v.category}
            onChange={(e) => set({ category: e.target.value })}
            className="h-10 w-full rounded-xl bg-transparent px-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus:outline-none"
            aria-label="Category"
          >
            {categoryOptions.map((opt, i) => (
              <option key={`${opt || "all"}-${i}`} value={opt}>
                {opt ? opt : "All"}
              </option>
            ))}
          </select>
        </div>

        <Divider hidden={compactKeywordOnly} />
        <div
          className={`flex items-center gap-3 ${compactKeywordOnly ? "w-full" : "md:flex-1"} md:flex md:flex-1`}
        >
          <FieldLabel title="Keyword" subtitle="Name / Country" />
          <input
            value={v.keyword}
            onChange={(e) => set({ keyword: e.target.value })}
            onFocus={() => setKeywordFocused(true)}
            onBlur={() => setKeywordFocused(false)}
            placeholder="Search the List"
            className="h-10 w-full flex-1 rounded-xl bg-transparent px-2 text-sm text-zinc-900 placeholder:text-zinc-400 hover:bg-zinc-50 focus:outline-none"
            aria-label="Keyword"
          />
          <Button
            type="submit"
            size="sm"
            className="
              h-10 shrink-0 rounded-full px-4 !bg-rose-600 !text-white hover:!bg-rose-700
              focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400
              focus-visible:ring-offset-2 focus-visible:ring-offset-white
            "
            aria-label="Search"
            title="Search"
          >
            <SearchIcon fontSize="small" />
            <span className="ml-2 text-sm font-semibold md:hidden">Search</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
