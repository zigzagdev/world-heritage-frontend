import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { parseHeritageSearchParams } from "../search.params.ts";
import type { HeritageSearchParams } from "../types.ts";
import { SearchHeritagePage } from "../views/SearchHeritagePage";

export type SearchHeritageContainerDeps<ItemVm = unknown> = {
  useQuery: (params: HeritageSearchParams) => {
    data: unknown;
    isLoading: boolean;
    error: unknown;
  };

  select: (raw: unknown) => {
    itemsRaw: unknown[];
    pagination: unknown | null;
  };

  mapToVm: (itemsRaw: unknown[]) => ItemVm[];
};

type Props<ItemVm = unknown> = {
  deps: SearchHeritageContainerDeps<ItemVm>;
};

export function SearchHeritageContainer<ItemVm = unknown>({ deps }: Props<ItemVm>) {
  const { search } = useLocation();
  const params: HeritageSearchParams = useMemo(() => parseHeritageSearchParams(search), [search]);
  const { data, isLoading, error } = deps.useQuery(params);
  const { itemsRaw, pagination } = useMemo(() => deps.select(data), [deps, data]);
  const items = useMemo(() => deps.mapToVm(itemsRaw), [deps, itemsRaw]);

  return (
    <SearchHeritagePage
      params={params}
      items={items}
      pagination={pagination}
      isLoading={isLoading}
      error={error}
    />
  );
}
