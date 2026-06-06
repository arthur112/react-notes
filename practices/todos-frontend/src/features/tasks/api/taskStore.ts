import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskStatusFilter,
} from "../types/taskTypes";

type ListTasksParams = {
  page: number;
  pageSize: number;
  search: string;
  status: TaskStatusFilter;
};

export type TasksResult = {
  tasks: Task[];
  total: number;
};

export type CreateTaskInput = {
  dueDate: string;
  owner: string;
  priority: TaskPriority;
  title: string;
};

export type UpdateTaskStatusInput = {
  status: TaskStatus;
  taskId: Task["id"];
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Audit onboarding flow",
    owner: "Maya",
    dueDate: "2026-06-11",
    status: "doing",
    priority: "high",
  },
  {
    id: 2,
    title: "Draft API error states",
    owner: "Noah",
    dueDate: "2026-06-09",
    status: "todo",
    priority: "medium",
  },
  {
    id: 3,
    title: "Refine empty table copy",
    owner: "Iris",
    dueDate: "2026-06-14",
    status: "done",
    priority: "low",
  },
  {
    id: 4,
    title: "Compare shadcn table patterns",
    owner: "Arthur",
    dueDate: "2026-06-08",
    status: "todo",
    priority: "high",
  },
  {
    id: 5,
    title: "Document pagination states",
    owner: "Lena",
    dueDate: "2026-06-17",
    status: "doing",
    priority: "medium",
  },
  {
    id: 6,
    title: "Smoke-test task creation",
    owner: "Omar",
    dueDate: "2026-06-12",
    status: "todo",
    priority: "low",
  },
  {
    id: 7,
    title: "Review mobile table overflow",
    owner: "Maya",
    dueDate: "2026-06-19",
    status: "todo",
    priority: "medium",
  },
  {
    id: 8,
    title: "Trim duplicate form classes",
    owner: "Arthur",
    dueDate: "2026-06-21",
    status: "done",
    priority: "low",
  },
  {
    id: 9,
    title: "Validate filter reset behavior",
    owner: "Noah",
    dueDate: "2026-06-15",
    status: "doing",
    priority: "high",
  },
];

let tasks = [...initialTasks];
let nextTaskId = initialTasks.length + 1;

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function matchesSearch(task: Task, search: string): boolean {
  const value = search.trim().toLowerCase();

  if (!value) {
    return true;
  }

  return [
    task.id,
    task.title,
    task.owner,
    task.dueDate,
    task.status,
    task.priority,
  ]
    .join(" ")
    .toLowerCase()
    .includes(value);
}

export async function listTasks({
  page,
  pageSize,
  search,
  status,
}: ListTasksParams): Promise<TasksResult> {
  const filteredTasks = tasks
    .filter((task) => status === "all" || task.status === status)
    .filter((task) => matchesSearch(task, search))
    .sort((taskA, taskB) => {
      const byDueDate = taskA.dueDate.localeCompare(taskB.dueDate);
      return byDueDate || taskA.id - taskB.id;
    });
  const start = (page - 1) * pageSize;

  return {
    tasks: filteredTasks.slice(start, start + pageSize),
    total: filteredTasks.length,
  };
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const task: Task = {
    id: nextTaskId,
    title: input.title.trim(),
    owner: input.owner.trim() || "Unassigned",
    dueDate: input.dueDate || todayInputValue(),
    status: "todo",
    priority: input.priority,
  };

  nextTaskId += 1;
  tasks = [task, ...tasks];

  return task;
}

export async function deleteTask(taskId: Task["id"]): Promise<void> {
  tasks = tasks.filter((task) => task.id !== taskId);
}

export async function updateTaskStatus({
  status,
  taskId,
}: UpdateTaskStatusInput): Promise<Task> {
  const task = tasks.find((candidate) => candidate.id === taskId);

  if (!task) {
    throw new Error("Task not found.");
  }

  const updatedTask = { ...task, status };
  tasks = tasks.map((candidate) =>
    candidate.id === taskId ? updatedTask : candidate,
  );

  return updatedTask;
}

