import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@api/apiClient";
import { todoQueryKeys } from "./todoQueryKeys";
import type { Todo } from "../types/todoTypes";

export type { Todo } from "../types/todoTypes";

export type GetTodoQueryParams = {
  todoId: number;
};

async function getTodo({ todoId }: GetTodoQueryParams): Promise<Todo> {
  const { data } = await apiClient.get<Todo>(`/todos/${todoId}`);
  return data;
}

export const useGetTodo = (params: GetTodoQueryParams) =>
  useQuery<Todo, Error>({
    queryKey: todoQueryKeys.detail(params.todoId),
    queryFn: () => getTodo(params),
  });
