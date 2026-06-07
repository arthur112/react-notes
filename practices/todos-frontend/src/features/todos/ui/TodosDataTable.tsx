import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type DataTableColumnMeta } from "@ui/DataTable";
import { todoTypeLabels, type Todo, type TodoType } from "../types/todoTypes";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type TodosDataTableProps = {
  deletingTodoId?: Todo["id"];
  hasActiveFilters: boolean;
  isLoading: boolean;
  onDeleteTodo: (todoId: Todo["id"]) => void;
  todos: Todo[];
};

const todoTypeClassNames: Record<TodoType, string> = {
  feature:
    "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  bug: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
  chore:
    "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  documentation:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
};

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
}

function TodoTypeBadge({ type }: { type: TodoType }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium ${todoTypeClassNames[type]}`}
    >
      {todoTypeLabels[type]}
    </span>
  );
}

export function TodosDataTable({
  deletingTodoId,
  hasActiveFilters,
  isLoading,
  onDeleteTodo,
  todos,
}: TodosDataTableProps) {
  const columns = useMemo<ColumnDef<Todo>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => getValue<number>(),
        size: 72,
      },
      {
        accessorKey: "name",
        header: "Todo",
        cell: ({ getValue }) => getValue<string>(),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => formatDate(getValue<string>()),
        size: 150,
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => (
          <TodoTypeBadge type={getValue<TodoType>()} />
        ),
        size: 150,
      },
      {
        accessorKey: "completedDate",
        header: "Completed",
        cell: ({ getValue }) => {
          const completedDate = getValue<Todo["completedDate"]>();

          return completedDate ? (
            formatDate(completedDate)
          ) : (
            <span className="text-(--text-muted)">Open</span>
          );
        },
        size: 160,
      },
      {
        id: "actions",
        header: "Action",
        enableSorting: false,
        size: 100,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        } satisfies DataTableColumnMeta,
        cell: ({ row }) => {
          const isDeleting = deletingTodoId === row.original.id;

          return (
            <button
              type="button"
              className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-(--border) bg-(--surface) px-3 text-sm font-medium text-(--danger) disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isDeleting}
              onClick={() => onDeleteTodo(row.original.id)}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          );
        },
      },
    ],
    [deletingTodoId, onDeleteTodo],
  );

  return (
    <DataTable
      columns={columns}
      data={todos}
      emptyMessage={
        hasActiveFilters ? "No todos match your filters." : "No todos yet."
      }
      isLoading={isLoading}
      loadingMessage="Loading todos..."
    />
  );
}
