import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@api/apiClient";
import { todoQueryKeys } from "./todoQueryKeys";
import type { TodoType } from "../types/todoModels";

async function getTodoTypes(): Promise<TodoType[]> {
  const { data } = await apiClient.get<unknown>("/todos/types");

  if (!Array.isArray(data)) {
    throw new Error("Todo types response must be an array.");
  }

  return data.filter(
    (todoType): todoType is TodoType =>
      typeof todoType === "string" && todoType.trim().length > 0,
  );
}

export const useGetTodoTypes = () =>
  useQuery<TodoType[], Error>({
    queryKey: todoQueryKeys.types(),
    queryFn: getTodoTypes,
    staleTime: Number.POSITIVE_INFINITY,
  });
