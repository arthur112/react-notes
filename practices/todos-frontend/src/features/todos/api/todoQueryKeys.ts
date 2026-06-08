export type TodoListQueryKeyParams = {
  completedDateFrom: string;
  completedDateTo: string;
  knownTypes: string[];
  page: number;
  pageSize: number;
  search: string;
  types: string[];
};

export const todoQueryKeys = {
  all: ["todos"] as const,
  types: () => [...todoQueryKeys.all, "types"] as const,
  list: (params: TodoListQueryKeyParams) =>
    [...todoQueryKeys.all, "list", params] as const,
  detail: (todoId: number) => [...todoQueryKeys.all, "detail", todoId] as const,
};
