import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  CATEGORIES,
  STUDY_REGIONS,
  type Category,
  type SearchValues,
  type StudyRegion,
} from "../../../../domain/types.ts";
import { useText } from "@shared/locale/ui-text.ts";

type Props = {
  value?: SearchValues;
  onChange?: (next: SearchValues) => void;
  onSubmit?: (next: {
    region?: StudyRegion | "";
    category?: Category | "";
    keyword?: string;
    yearInscribedFrom?: string;
    yearInscribedTo?: string;
    isEndangered?: boolean;
  }) => void;
};

const isCategory = (value: string): value is Category =>
  (CATEGORIES as readonly string[]).includes(value);

const toCategoryOrEmpty = (value: string): Category | "" => {
  if (value === "") return "";
  return isCategory(value) ? value : "";
};

export function HeritageSearchForm({ value, onChange, onSubmit }: Props) {
  const text = useText();
  const regionOptions: readonly (StudyRegion | "")[] = ["", ...STUDY_REGIONS];
  const categoryOptions: readonly (Category | "")[] = ["", ...CATEGORIES];

  const [internal, setInternal] = useState<SearchValues>({
    region: value?.region ?? "",
    category: value?.category ?? "",
    keyword: value?.keyword ?? "",
    yearInscribedFrom: value?.yearInscribedFrom ?? "",
    yearInscribedTo: value?.yearInscribedTo ?? "",
    isEndangered: value?.isEndangered ?? false,
  });

  const searchValues = value ?? internal;

  const set = (patch: Partial<SearchValues>) => {
    const next: SearchValues = { ...searchValues, ...patch };
    if (!value) setInternal(next);
    onChange?.(next);
  };

  const submit = () => {
    onSubmit?.({
      region: searchValues.region || undefined,
      category: searchValues.category || undefined,
      keyword: searchValues.keyword.trim() || undefined,
      yearInscribedFrom: searchValues.yearInscribedFrom || undefined,
      yearInscribedTo: searchValues.yearInscribedTo || undefined,
      isEndangered: searchValues.isEndangered || undefined,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Region チップ */}
      <div className="px-4 pt-3 pb-2 border-b border-zinc-100">
        <div className="text-[11px] font-semibold text-zinc-400 mb-2">{text.region}</div>
        <div className="flex flex-wrap gap-2">
          {regionOptions.map((opt) => {
            const isActive = searchValues.region === opt;
            return (
              <button
                key={opt || "all"}
                type="button"
                onClick={() => set({ region: opt })}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${
                    isActive
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  }
                `}
              >
                {opt === "" ? text.all : text.regionLabels[opt]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category チップ */}
      <div className="px-4 pt-3 pb-2 border-b border-zinc-100">
        <div className="text-[11px] font-semibold text-zinc-400 mb-2">{text.category}</div>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((opt) => {
            const isActive = searchValues.category === opt;
            return (
              <button
                key={opt || "all"}
                type="button"
                onClick={() => set({ category: toCategoryOrEmpty(opt) })}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${
                    isActive
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  }
                `}
              >
                {opt === "" ? text.all : text.categoryLabels[opt]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 危機遺産フラグ */}
      <div className="px-4 py-2 border-b border-zinc-100">
        <label className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
          <input
            type="checkbox"
            checked={searchValues.isEndangered}
            onChange={(e) => set({ isEndangered: e.target.checked })}
            className="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-400"
          />
          {text.endangeredOnly}
        </label>
      </div>

      {/* Year + Keyword + Submit */}
      <div className="divide-y divide-zinc-100 sm:divide-y-0 sm:flex sm:items-stretch">
        {/* Year */}
        <div className="flex items-center gap-3 px-4 py-3 sm:border-r sm:border-zinc-100 sm:w-[220px] shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-zinc-500">{text.yearInscribed}</div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                inputMode="numeric"
                value={searchValues.yearInscribedFrom}
                onChange={(e) => set({ yearInscribedFrom: e.target.value })}
                placeholder={text.yearFrom}
                className="w-full bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none"
                aria-label={`${text.yearInscribed} ${text.yearFrom}`}
              />
              <span className="text-zinc-300">–</span>
              <input
                type="number"
                inputMode="numeric"
                value={searchValues.yearInscribedTo}
                onChange={(e) => set({ yearInscribedTo: e.target.value })}
                placeholder={text.yearTo}
                className="w-full bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none"
                aria-label={`${text.yearInscribed} ${text.yearTo}`}
              />
            </div>
          </div>
        </div>
        {/* Keyword + Submit */}
        <div className="flex flex-1 items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-zinc-500">{text.keyword}</div>
            <input
              value={searchValues.keyword}
              onChange={(e) => set({ keyword: e.target.value })}
              placeholder={text.keywordPlaceholder}
              className="w-full bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none"
              aria-label={text.keyword}
            />
          </div>

          <button
            type="submit"
            className="
              shrink-0 flex items-center gap-1.5 h-9 rounded-full px-4
              bg-rose-600 text-white text-sm font-semibold
              hover:bg-rose-700 transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400
            "
            aria-label={text.search}
          >
            <SearchIcon fontSize="small" />
            <span>{text.search}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
