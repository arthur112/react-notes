import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@api/apiClient";
import { todoQueryKeys } from "./todoQueryKeys";
import type { Todo } from "../types/todoTypes";

export type { Todo } from "../types/todoTypes";

export type CreateTodoInput = {
  name: string;
  date: string;
};

async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const { data } = await apiClient.post<Todo, CreateTodoInput>("/todos", input);
  return data;
}

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, CreateTodoInput>({
    mutationFn: createTodo,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: todoQueryKeys.all });
    },
  });
};
