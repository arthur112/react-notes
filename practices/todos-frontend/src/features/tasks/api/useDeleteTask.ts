import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "./taskStore";
import { taskQueryKeys } from "./taskQueryKeys";
import type { Task } from "../types/taskTypes";

export type DeleteTaskInput = Task["id"];

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteTaskInput>({
    mutationFn: deleteTask,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
};

