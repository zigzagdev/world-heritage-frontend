import { useMemo, useState } from "react";
import { Button } from "@shared/uis/Button";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  title: string;
  onSearch?: (q: { region?: string; category?: string; keyword?: string }) => void;
  onKeywordChange?: (keyword: string) => void;
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

export function HeritageSubHeader({ title, onSearch, onKeywordChange }: Props) {
  const regionOptions = useMemo(() => ["", "AFR", "ARB", "APA", "EUR", "LAC"] as const, []);
  const categoryOptions = useMemo(() => ["", "Cultural", "Natural", "Mixed"] as const, []);

  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");

  const submit = () => {
    onSearch?.({
      region: region || undefined,
      category: category || undefined,
      keyword: keyword.trim() || undefined,
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
                console.log(title);
                onKeywordChange?.(keyword);
                submit();
              }}
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="flex items-center gap-3 md:w-[180px]">
                  <FieldLabel title="Region" subtitle="Area" />
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="h-10 w-full rounded-xl bg-transparent px-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus:outline-none"
                    aria-label="Region"
                  >
                    {regionOptions.map((v, i) => (
                      <option key={`${v || "all"}-${i}`} value={v}>
                        {v ? v : "All"}
                      </option>
                    ))}
                  </select>
                </div>

                <Divider />

                <div className="flex items-center gap-3 md:w-[220px]">
                  <FieldLabel title="Category" subtitle="Type" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 w-full rounded-xl bg-transparent px-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus:outline-none"
                    aria-label="Category"
                  >
                    {categoryOptions.map((v, i) => (
                      <option key={`${v || "all"}-${i}`} value={v}>
                        {v ? v : "All"}
                      </option>
                    ))}
                  </select>
                </div>

                <Divider />

                <div className="flex items-center gap-3 md:flex-1">
                  <FieldLabel title="Keyword" subtitle="Name / Country" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
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
