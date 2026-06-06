import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  LoaderCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Task, TaskPriority, TaskStatus } from "../types/taskTypes";

type TaskSortKey = "id" | "title" | "owner" | "dueDate" | "status" | "priority";
type TaskSortDirection = "asc" | "desc";

type TaskSort = {
  direction: TaskSortDirection;
  key: TaskSortKey;
};

type TasksDataTableProps = {
  deletingTaskId?: Task["id"];
  isLoading: boolean;
  onDeleteTask: (taskId: Task["id"]) => void;
  onStatusChange: (taskId: Task["id"], status: TaskStatus) => void;
  search: string;
  tasks: Task[];
  updatingTaskId?: Task["id"];
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo",
  doing: "Doing",
  done: "Done",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const statusClassNames: Record<TaskStatus, string> = {
  todo: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300",
  doing:
    "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  done: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
};

const priorityClassNames: Record<TaskPriority, string> = {
  low: "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  medium:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  high: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
};

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
}

function getNextStatus(status: TaskStatus): TaskStatus {
  if (status === "todo") {
    return "doing";
  }

  if (status === "doing") {
    return "done";
  }

  return "todo";
}

function compareTasks(taskA: Task, taskB: Task, sort: TaskSort): number {
  const first = taskA[sort.key];
  const second = taskB[sort.key];
  const result =
    typeof first === "number" && typeof second === "number"
      ? first - second
      : String(first).localeCompare(String(second));

  return sort.direction === "asc" ? result : -result;
}

function Badge({
  children,
  className,
}: {
  children: string;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

function SortButton({
  active,
  children,
  direction,
  onClick,
}: {
  active: boolean;
  children: string;
  direction: TaskSortDirection;
  onClick: () => void;
}) {
  const Icon = active ? (direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 h-8 px-2 text-muted-foreground"
      onClick={onClick}
    >
      {children}
      <Icon />
    </Button>
  );
}

export function TasksDataTable({
  deletingTaskId,
  isLoading,
  onDeleteTask,
  onStatusChange,
  search,
  tasks,
  updatingTaskId,
}: TasksDataTableProps) {
  const [sort, setSort] = useState<TaskSort>({
    key: "dueDate",
    direction: "asc",
  });
  const sortedTasks = useMemo(
    () => [...tasks].sort((taskA, taskB) => compareTasks(taskA, taskB, sort)),
    [sort, tasks],
  );
  const emptyMessage = search.trim()
    ? "No tasks match your search."
    : "No tasks yet.";

  function toggleSort(key: TaskSortKey) {
    setSort((currentSort) => ({
      key,
      direction:
        currentSort.key === key && currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">
              <SortButton
                active={sort.key === "id"}
                direction={sort.direction}
                onClick={() => toggleSort("id")}
              >
                ID
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton
                active={sort.key === "title"}
                direction={sort.direction}
                onClick={() => toggleSort("title")}
              >
                Task
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton
                active={sort.key === "owner"}
                direction={sort.direction}
                onClick={() => toggleSort("owner")}
              >
                Owner
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton
                active={sort.key === "dueDate"}
                direction={sort.direction}
                onClick={() => toggleSort("dueDate")}
              >
                Due
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton
                active={sort.key === "status"}
                direction={sort.direction}
                onClick={() => toggleSort("status")}
              >
                Status
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton
                active={sort.key === "priority"}
                direction={sort.direction}
                onClick={() => toggleSort("priority")}
              >
                Priority
              </SortButton>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                Loading tasks...
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading && sortedTasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : null}

          {sortedTasks.map((task) => {
            const isDeleting = deletingTaskId === task.id;
            const isUpdating = updatingTaskId === task.id;
            const nextStatus = getNextStatus(task.status);

            return (
              <TableRow key={task.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {task.id}
                </TableCell>
                <TableCell className="min-w-48 font-medium">
                  {task.title}
                </TableCell>
                <TableCell>{task.owner}</TableCell>
                <TableCell>{formatDate(task.dueDate)}</TableCell>
                <TableCell>
                  <Badge className={statusClassNames[task.status]}>
                    {statusLabels[task.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={priorityClassNames[task.priority]}>
                    {priorityLabels[task.priority]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                      onClick={() => onStatusChange(task.id, nextStatus)}
                    >
                      {isUpdating ? (
                        <LoaderCircle className="animate-spin" />
                      ) : task.status === "done" ? (
                        <RotateCcw />
                      ) : (
                        <CheckCircle2 />
                      )}
                      {task.status === "done" ? "Reopen" : "Advance"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => onDeleteTask(task.id)}
                    >
                      {isDeleting ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

