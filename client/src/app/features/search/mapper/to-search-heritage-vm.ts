import type { WorldHeritageVm } from "../../../../domain/types";
import type { HeritageSearchResponse, Pagination } from "../types";
import { toWorldHeritageListVm } from "../../heritages/mappers/to-world-heritage-vm.ts";

export type HeritageSearchResultVm = {
  items: WorldHeritageVm[];
  pagination: Pagination;
  isFirstPage: boolean;
  isLastPage: boolean;
  rangeText: string;
};

const fmtRangeText = (p: Pagination, count: number) => {
  if (count === 0) {
    return `0 of ${p.total.toLocaleString("en-CA")}`;
  }
  const start = (p.current_page - 1) * p.per_page + 1;
  const end = start + count - 1;
  return `${start}–${end} of ${p.total.toLocaleString("en-CA")}`;
};

export const toHeritageSearchResultVm = (res: HeritageSearchResponse): HeritageSearchResultVm => {
  const items = toWorldHeritageListVm(res.data.data);
  const pagination = res.data.pagination;

  return {
    items,
    pagination,
    isFirstPage: pagination.current_page <= 1,
    isLastPage: pagination.current_page >= pagination.last_page,
    rangeText: fmtRangeText(pagination, items.length),
  };
};
