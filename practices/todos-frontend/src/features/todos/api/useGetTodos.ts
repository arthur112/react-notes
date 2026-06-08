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
import type { Todo } from "../types/todoModels";

export type { Todo } from "../types/todoModels";

export type TodosResult = {
  todos: Todo[];
  total: number;
};

export type GetTodosQueryParams = {
  completedDateFrom?: string;
  completedDateTo?: string;
  knownTypes?: string[];
  page?: number;
  pageSize?: number;
  search?: string;
  types?: string[];
};

type TodosApiResponse =
  {
    data: Todo[];
    count: number;
  };

const normalizeParams = (
  params: GetTodosQueryParams = {},
): TodoListQueryKeyParams => ({
  completedDateFrom: params.completedDateFrom ?? "",
  completedDateTo: params.completedDateTo ?? "",
  knownTypes: params.knownTypes ?? [],
  page: params.page ?? 1,
  pageSize: params.pageSize ?? 50,
  search: params.search ?? "",
  types: params.types ?? [],
});

function buildTodosQuery(params: TodoListQueryKeyParams): IGridifyQuery {
  const builder = new GridifyQueryBuilder()
    .setPage(params.page)
    .setPageSize(params.pageSize);
  const search = params.search.trim();
  const completedDateFrom = params.completedDateFrom.trim();
  const completedDateTo = params.completedDateTo.trim();
  type TodoQueryFilter = () => void;

  function createSearchFilter(): TodoQueryFilter | null {
    if (!search) {
      return null;
    }

    return () => {
      builder
        .startGroup()
        .addCondition("name", ConditionalOperator.Contains, search, false)
        .or()
        .addCondition("date", ConditionalOperator.Contains, search, false);

      const todoId = Number(search);

      if (Number.isInteger(todoId)) {
        builder.or().addCondition("id", ConditionalOperator.Equal, todoId);
      }

      const matchingType = params.knownTypes.find(
        (type) => type.toLowerCase() === search.toLowerCase(),
      );

      if (matchingType) {
        builder
          .or()
          .addCondition("type", ConditionalOperator.Equal, matchingType);
      }

      builder.endGroup();
    };
  }

  function createTypesFilter(): TodoQueryFilter | null {
    if (params.types.length === 0) {
      return null;
    }

    return () => {
      builder.startGroup();

      params.types.forEach((type, index) => {
        if (index > 0) {
          builder.or();
        }

        builder.addCondition("type", ConditionalOperator.Equal, type);
      });

      builder.endGroup();
    };
  }

  function createCompletedDateFromFilter(): TodoQueryFilter | null {
    if (!completedDateFrom) {
      return null;
    }

    return () => {
      builder.addCondition(
        "completedDate",
        ConditionalOperator.GreaterThanOrEqual,
        completedDateFrom,
      );
    };
  }

  function createCompletedDateToFilter(): TodoQueryFilter | null {
    if (!completedDateTo) {
      return null;
    }

    return () => {
      builder.addCondition(
        "completedDate",
        ConditionalOperator.LessThanOrEqual,
        completedDateTo,
      );
    };
  }

  const filters = [
    createSearchFilter(),
    createTypesFilter(),
    createCompletedDateFromFilter(),
    createCompletedDateToFilter(),
  ].filter((filter): filter is TodoQueryFilter => filter !== null);

  filters.forEach((addFilter, index) => {
    if (index > 0) {
      builder.and();
    }

    addFilter();
  });

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
