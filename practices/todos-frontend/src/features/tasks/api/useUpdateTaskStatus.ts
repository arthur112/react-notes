import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTaskStatus,
  type UpdateTaskStatusInput,
} from "./taskStore";
import { taskQueryKeys } from "./taskQueryKeys";
import type { Task } from "../types/taskTypes";

export type { UpdateTaskStatusInput } from "./taskStore";

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskStatusInput>({
    mutationFn: updateTaskStatus,
    onSuccess: (task) => {
      void queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.detail(task.id),
      });
    },
  });
};

