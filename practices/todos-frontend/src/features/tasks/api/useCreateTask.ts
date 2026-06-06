import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, type CreateTaskInput } from "./taskStore";
import { taskQueryKeys } from "./taskQueryKeys";
import type { Task } from "../types/taskTypes";

export type { CreateTaskInput } from "./taskStore";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput>({
    mutationFn: createTask,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
};

