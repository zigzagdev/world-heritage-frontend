import type { ApiWorldHeritageDto, WorldHeritageVm } from "../../../../domain/types";
import type { HeritageSearchResponse } from "../types";
import { toWorldHeritageListVm } from "../../heritages/mappers/to-world-heritage-vm";

export type UiPagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type HeritageSearchResultVm = {
  items: WorldHeritageVm[];
  pagination: UiPagination;
  isFirstPage: boolean;
  isLastPage: boolean;
  rangeText: string;
};

type FlatSuccess = { status: "success"; data: ApiWorldHeritageDto[] };
type PagedSuccess = {
  status: "success";
  data: { items: ApiWorldHeritageDto[]; pagination: UiPagination };
};

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

const isUiPagination = (v: unknown): v is UiPagination => {
  if (!isObject(v)) return false;
  const n = (x: unknown) => typeof x === "number" && Number.isFinite(x);
  return n(v.current_page) && n(v.per_page) && n(v.total) && n(v.last_page);
};

const isFlatSuccess = (v: unknown): v is FlatSuccess => {
  if (!isObject(v)) return false;
  return v.status === "success" && Array.isArray(v.data);
};

const isPagedSuccess = (v: unknown): v is PagedSuccess => {
  if (!isObject(v)) return false;
  if (v.status !== "success") return false;
  const d = v.data;
  if (!isObject(d)) return false;
  return Array.isArray(d.items) && isUiPagination(d.pagination);
};

const fmtRangeText = (p: UiPagination, count: number) => {
  if (count === 0) return `0 of ${p.total.toLocaleString("en-CA")}`;
  const start = (p.current_page - 1) * p.per_page + 1;
  const end = start + count - 1;
  return `${start}–${end} of ${p.total.toLocaleString("en-CA")}`;
};

export const toHeritageSearchResultVm = (
  res: HeritageSearchResponse | FlatSuccess,
): HeritageSearchResultVm => {
  if (isPagedSuccess(res)) {
    const items = toWorldHeritageListVm(res.data.items);
    const pagination = res.data.pagination;

    return {
      items,
      pagination,
      isFirstPage: pagination.current_page <= 1,
      isLastPage: pagination.current_page >= pagination.last_page,
      rangeText: fmtRangeText(pagination, items.length),
    };
  }

  if (isFlatSuccess(res)) {
    const items = toWorldHeritageListVm(res.data);
    const total = res.data.length;

    const pagination: UiPagination = {
      current_page: 1,
      per_page: total,
      total,
      last_page: 1,
    };

    return {
      items,
      pagination,
      isFirstPage: true,
      isLastPage: true,
      rangeText: fmtRangeText(pagination, items.length),
    };
  }

  throw new Error("Unexpected response shape for heritage search");
};
