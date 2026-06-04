import { useQuery } from "@tanstack/react-query";
import {
  ConditionalOperator,
  GridifyQueryBuilder,
  type IGridifyQuery,
} from "gridify-client";
import { apiClient } from "@api/apiClient";
import { asSearchParams } from "@utils/gridify";
import {
  todoQueryKeys,
  type TodoListQueryKeyParams,
} from "./todoQueryKeys";
import type { Todo } from "../types/todoTypes";

export type { Todo } from "../types/todoTypes";

export type TodosResult = {
  todos: Todo[];
  total: number;
};

export type GetTodosQueryParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

type TodosApiResponse =
  {
    data: Todo[];
    count: number;
  };

const normalizeParams = (
  params: GetTodosQueryParams = {},
): TodoListQueryKeyParams => ({
  page: params.page ?? 1,
  pageSize: params.pageSize ?? 50,
  search: params.search ?? "",
});

function buildTodosQuery(params: TodoListQueryKeyParams): IGridifyQuery {
  const builder = new GridifyQueryBuilder()
    .setPage(params.page)
    .setPageSize(params.pageSize);
  const search = params.search.trim();

  if (!search) {
    return builder.build();
  }

  builder
    .startGroup()
    .addCondition("name", ConditionalOperator.Contains, search, false)
    .or()
    .addCondition("date", ConditionalOperator.Contains, search, false);

  const todoId = Number(search);

  if (Number.isInteger(todoId)) {
    builder.or().addCondition("id", ConditionalOperator.Equal, todoId);
  }

  builder.endGroup();

  return builder.build();
}

async function getTodos(params: TodoListQueryKeyParams): Promise<TodosResult> {
  const query = asSearchParams(buildTodosQuery(params)).toString();
  const { data } = await apiClient.get<TodosApiResponse>(
    query ? `/todos?${query}` : "/todos",
  );

  return {
    todos: data.data,
    total: data.count,
  };
}

export const useGetTodos = (params: GetTodosQueryParams = {}) => {
  const queryParams = normalizeParams(params);

  return useQuery<TodosResult, Error>({
    queryKey: todoQueryKeys.list(queryParams),
    queryFn: () => getTodos(queryParams),
  });
};
