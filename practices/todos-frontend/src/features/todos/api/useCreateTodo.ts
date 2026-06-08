import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@api/apiClient";
import { todoQueryKeys } from "./todoQueryKeys";
import type { Todo, TodoType } from "../types/todoModels";

export type { Todo } from "../types/todoModels";

export type CreateTodoInput = {
  completedDate: string | null;
  date: string;
  name: string;
  type: TodoType;
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
