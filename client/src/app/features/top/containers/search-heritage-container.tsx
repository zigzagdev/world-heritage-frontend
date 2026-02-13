// import { useState } from "react";
// import { searchHeritages } from "../apis/searchHeritages";
// import { mapHeritageSummaryVm } from "../mappers/...";
// import { SearchHeritageView } from "../components/search/SearchHeritageView";

// type HeritageSearchParams = {
//   region: string | null;
//   category: string | null;
//   keyword: string;
//   page: number;
//   pageSize: number;
//   sort?: "relevance" | "name" | "year";
// };

export function SearchHeritageContainer() {
  // const [params, setParams] = useState<HeritageSearchParams>({
  //   region: null,
  //   category: null,
  //   keyword: "",
  //   page: 1,
  //   pageSize: 20,
  //   sort: "relevance",
  // });

  // const onChangeQuery = (query: string) => {
  //   setParams((s) => ({ ...s, query }));
  // };
  //
  // const onSubmit = async () => {
  //   setParams((s) => ({ ...s, loading: true, error: null }));
  //   try {
  //     // const res = await searchHeritages({ q: params.query });
  //     // const items = res.items.map(mapHeritageSummaryVm);
  //     // const items: unknown[] = [];
  //     // setParams((s) => ({ ...s, items, loading: false }));
  //   } catch (e) {
  //     setParams((s) => ({ ...s, loading: false, error: "Failed to search" }));
  //   }
  // };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-4">
        <div className="text-sm font-extrabold tracking-wide text-zinc-900">SEARCH</div>
        <div className="text-sm text-zinc-500 mt-1">Header placeholder</div>
      </header>
      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-4">
        <div className="text-sm font-bold text-zinc-900">Search bar</div>
        <div className="mt-3 h-12 rounded-xl bg-zinc-100" />
      </section>
      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-4">
        <div className="text-sm font-bold text-zinc-900">Results</div>
        <div className="mt-3 grid gap-3">
          <div className="h-16 rounded-xl bg-zinc-100" />
          <div className="h-16 rounded-xl bg-zinc-100" />
          <div className="h-16 rounded-xl bg-zinc-100" />
        </div>
      </section>
    </div>
  );
}
