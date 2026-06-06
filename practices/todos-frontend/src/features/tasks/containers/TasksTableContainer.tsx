import { Search } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCreateTask, type CreateTaskInput } from "../api/useCreateTask";
import { useDeleteTask } from "../api/useDeleteTask";
import { useGetTasks } from "../api/useGetTasks";
import { useUpdateTaskStatus } from "../api/useUpdateTaskStatus";
import {
  taskStatuses,
  type TaskStatus,
  type TaskStatusFilter,
} from "../types/taskTypes";
import { AddTaskForm, type AddTaskFormSubmitHelpers } from "../ui/AddTaskForm";
import { TasksDataTable } from "../ui/TasksDataTable";
import { TasksPagination } from "../ui/TasksPagination";

const PAGE_SIZE = 6;

const statusFilterLabels: Record<TaskStatusFilter, string> = {
  all: "All statuses",
  todo: "Todo",
  doing: "Doing",
  done: "Done",
};

function Root({ children }: { children: ReactNode }) {
  return <div className="grid gap-4">{children}</div>;
}

function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 rounded-lg border bg-card p-3 shadow-sm">
      {children}
    </div>
  );
}

function Alerts({
  mutationError,
  onRetry,
  queryError,
}: {
  mutationError?: Error | null;
  onRetry: () => void;
  queryError?: Error | null;
}) {
  return (
    <>
      {queryError ? (
        <div
          className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          role="alert"
        >
          <span>{queryError.message}</span>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}

      {mutationError ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          role="alert"
        >
          {mutationError.message}
        </p>
      ) : null}
    </>
  );
}

const TasksTable = {
  alerts: Alerts,
  root: Root,
  toolbar: Toolbar,
} as const;

export function TasksTableContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("all");
  const debouncedSearch = useDebounce(search, 300);
  const tasksQuery = useGetTasks({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
    status: statusFilter,
  });
  const createTaskMutation = useCreateTask();
  const deleteTaskMutation = useDeleteTask();
  const updateTaskStatusMutation = useUpdateTaskStatus();
  const tasks = tasksQuery.data?.tasks ?? [];
  const deletingTaskId = deleteTaskMutation.isPending
    ? deleteTaskMutation.variables
    : undefined;
  const updatingTaskId = updateTaskStatusMutation.isPending
    ? updateTaskStatusMutation.variables?.taskId
    : undefined;
  const mutationError =
    createTaskMutation.error ??
    deleteTaskMutation.error ??
    updateTaskStatusMutation.error;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: TaskStatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleAddTask(
    values: CreateTaskInput,
    helpers: AddTaskFormSubmitHelpers,
  ) {
    createTaskMutation.mutate(values, {
      onSuccess: helpers.reset,
    });
  }

  function handleStatusChange(taskId: number, status: TaskStatus) {
    updateTaskStatusMutation.mutate({ taskId, status });
  }

  return (
    <TasksTable.root>
      <TasksTable.toolbar>
        <div className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_180px]">
          <label className="flex h-9 min-w-0 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <Search className="size-4" />
            <span className="sr-only">Search tasks</span>
            <input
              type="search"
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search tasks"
            />
          </label>

          <label className="sr-only" htmlFor="task-status-filter">
            Filter by status
          </label>
          <select
            id="task-status-filter"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={statusFilter}
            onChange={(event) =>
              handleStatusFilterChange(event.target.value as TaskStatusFilter)
            }
          >
            <option value="all">{statusFilterLabels.all}</option>
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {statusFilterLabels[status]}
              </option>
            ))}
          </select>
        </div>

        <AddTaskForm
          isSubmitting={createTaskMutation.isPending}
          onSubmit={handleAddTask}
        />
      </TasksTable.toolbar>

      <TasksTable.alerts
        queryError={tasksQuery.error}
        mutationError={mutationError}
        onRetry={() => {
          void tasksQuery.refetch();
        }}
      />

      <TasksDataTable
        tasks={tasks}
        isLoading={tasksQuery.isLoading}
        search={search}
        deletingTaskId={deletingTaskId}
        updatingTaskId={updatingTaskId}
        onDeleteTask={deleteTaskMutation.mutate}
        onStatusChange={handleStatusChange}
      />

      <TasksPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={tasksQuery.data?.total}
        onPageChange={setPage}
      />
    </TasksTable.root>
  );
}

