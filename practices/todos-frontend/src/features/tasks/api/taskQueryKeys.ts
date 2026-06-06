import type { TaskStatusFilter } from "../types/taskTypes";

export type TaskListQueryKeyParams = {
  page: number;
  pageSize: number;
  search: string;
  status: TaskStatusFilter;
};

export const taskQueryKeys = {
  all: ["tasks"] as const,
  list: (params: TaskListQueryKeyParams) =>
    [...taskQueryKeys.all, "list", params] as const,
  detail: (taskId: number) => [...taskQueryKeys.all, "detail", taskId] as const,
};

