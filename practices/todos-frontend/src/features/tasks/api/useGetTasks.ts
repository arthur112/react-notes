import { useQuery } from "@tanstack/react-query";
import { listTasks, type TasksResult } from "./taskStore";
import {
  taskQueryKeys,
  type TaskListQueryKeyParams,
} from "./taskQueryKeys";
import type { TaskStatusFilter } from "../types/taskTypes";

export type GetTasksQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: TaskStatusFilter;
};

const normalizeParams = (
  params: GetTasksQueryParams = {},
): TaskListQueryKeyParams => ({
  page: params.page ?? 1,
  pageSize: params.pageSize ?? 50,
  search: params.search ?? "",
  status: params.status ?? "all",
});

export const useGetTasks = (params: GetTasksQueryParams = {}) => {
  const queryParams = normalizeParams(params);

  return useQuery<TasksResult, Error>({
    queryKey: taskQueryKeys.list(queryParams),
    queryFn: () => listTasks(queryParams),
  });
};

