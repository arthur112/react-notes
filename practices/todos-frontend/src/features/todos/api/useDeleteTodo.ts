import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@api/apiClient";
import { todoQueryKeys } from "./todoQueryKeys";

export type DeleteTodoInput = number;

async function deleteTodo(todoId: DeleteTodoInput): Promise<void> {
  await apiClient.delete(`/todos/${todoId}`);
}

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteTodoInput>({
    mutationFn: deleteTodo,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: todoQueryKeys.all });
    },
  });
};
