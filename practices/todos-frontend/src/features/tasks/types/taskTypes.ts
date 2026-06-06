export const taskStatuses = ["todo", "doing", "done"] as const;
export const taskPriorities = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];
export type TaskStatusFilter = TaskStatus | "all";

export type Task = {
  id: number;
  title: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
};

