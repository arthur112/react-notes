export type TodoListQueryKeyParams = {
  search: string;
  page: number;
  pageSize: number;
};

export const todoQueryKeys = {
  all: ["todos"] as const,
  list: (params: TodoListQueryKeyParams) =>
    [...todoQueryKeys.all, "list", params] as const,
  detail: (todoId: number) => [...todoQueryKeys.all, "detail", todoId] as const,
};
