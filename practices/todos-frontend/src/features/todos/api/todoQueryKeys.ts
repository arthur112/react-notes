import type { TodoType } from "../types/todoTypes";

export type TodoListQueryKeyParams = {
  completedDateFrom: string;
  completedDateTo: string;
  page: number;
  pageSize: number;
  search: string;
  types: TodoType[];
};

export const todoQueryKeys = {
  all: ["todos"] as const,
  list: (params: TodoListQueryKeyParams) =>
    [...todoQueryKeys.all, "list", params] as const,
  detail: (todoId: number) => [...todoQueryKeys.all, "detail", todoId] as const,
};
