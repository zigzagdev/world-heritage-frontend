import type { ApiWorldHeritageDto, Pagination } from "../../../domain/types.ts";

export type HeritageSearchResponse =
  | {
      status: "success";
      data: {
        items: ApiWorldHeritageDto[];
        pagination: Pagination;
      };
    }
  | {
      status: "error";
      data: unknown;
    };
