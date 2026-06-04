import type { IGridifyQuery } from "gridify-client";

export function asSearchParams(query: Partial<IGridifyQuery>): URLSearchParams {
  const params = new URLSearchParams();

  if (query.page !== undefined) {
    params.set("page", String(query.page));
  }

  if (query.pageSize !== undefined) {
    params.set("pageSize", String(query.pageSize));
  }

  if (query.orderBy) {
    params.set("orderBy", query.orderBy);
  }

  if (query.filter) {
    params.set("filter", query.filter);
  }

  return params;
}
