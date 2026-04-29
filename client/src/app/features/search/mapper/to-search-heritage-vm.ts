import type { ApiWorldHeritageDto, Pagination, WorldHeritageVm } from "../../../../domain/types";
import type { HeritageSearchResponse } from "../types";
import { toWorldHeritageListVm } from "../../heritages/mappers/to-world-heritage-vm";

export type HeritageSearchResultVm = {
  items: WorldHeritageVm[];
  pagination: Pagination;
  isFirstPage: boolean;
  isLastPage: boolean;
  rangeText: string;
};

type FlatSuccess = { status: "success"; data: ApiWorldHeritageDto[] };
type PagedSuccess = {
  status: "success";
  data: { items: ApiWorldHeritageDto[]; pagination: Pagination };
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isPagination = (value: unknown): value is Pagination => {
  if (!isObject(value)) return false;
  return (
    isFiniteNumber(value.current_page) &&
    isFiniteNumber(value.per_page) &&
    isFiniteNumber(value.total) &&
    isFiniteNumber(value.last_page)
  );
};

const isFlatSuccess = (value: unknown): value is FlatSuccess => {
  if (!isObject(value)) return false;
  return value.status === "success" && Array.isArray(value.data);
};

const isPagedSuccess = (value: unknown): value is PagedSuccess => {
  if (!isObject(value)) return false;
  if (value.status !== "success") return false;
  const data = value.data;
  if (!isObject(data)) return false;
  return Array.isArray(data.items) && isPagination(data.pagination);
};

const formatRangeText = (pagination: Pagination, count: number): string => {
  if (count === 0) return `0 of ${pagination.total.toLocaleString("en-CA")}`;
  const start = (pagination.current_page - 1) * pagination.per_page + 1;
  const end = start + count - 1;
  return `${start}–${end} of ${pagination.total.toLocaleString("en-CA")}`;
};

export const toHeritageSearchResultVm = (
  response: HeritageSearchResponse | FlatSuccess,
): HeritageSearchResultVm => {
  if (isPagedSuccess(response)) {
    const items = toWorldHeritageListVm(response.data.items);
    const pagination = response.data.pagination;

    return {
      items,
      pagination,
      isFirstPage: pagination.current_page <= 1,
      isLastPage: pagination.current_page >= pagination.last_page,
      rangeText: formatRangeText(pagination, items.length),
    };
  }

  if (isFlatSuccess(response)) {
    const items = toWorldHeritageListVm(response.data);
    const total = response.data.length;

    const pagination: Pagination = {
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
      rangeText: formatRangeText(pagination, items.length),
    };
  }

  throw new Error("Unexpected response shape for heritage search");
};
