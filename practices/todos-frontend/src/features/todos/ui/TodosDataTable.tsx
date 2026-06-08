import { useMemo, type ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type DataTableColumnMeta } from "@ui/DataTable";
import {
  formatTodoTypeLabel,
  type Todo,
  type TodoType,
} from "../types/todoModels";

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
  onTodoRowClick: (todoId: Todo["id"]) => void;
  selectedTodoId: Todo["id"] | null;
  todos: Todo[];
};

const todoTypeBadgeClassNames = [
  "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
  "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
];

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
}

function getTodoTypeBadgeClassName(type: TodoType): string {
  const colorIndex =
    Array.from(type).reduce((total, character) => total + character.charCodeAt(0), 0) %
    todoTypeBadgeClassNames.length;

  return todoTypeBadgeClassNames[colorIndex] ?? todoTypeBadgeClassNames[0];
}

function TodoTypeBadge({ type }: { type: TodoType }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium ${getTodoTypeBadgeClassName(type)}`}
    >
      {formatTodoTypeLabel(type)}
    </span>
  );
}

function TodoDetailItem({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="grid min-w-0 gap-1">
      <dt className="text-xs font-semibold text-(--text-muted) uppercase">
        {label}
      </dt>
      <dd className="m-0 min-w-0 text-sm leading-6 break-words text-(--text-h)">
        {children}
      </dd>
    </div>
  );
}

export function TodoDetailsPanel({ todo }: { todo: Todo | null }) {
  if (!todo) {
    return null;
  }

  const description = todo.description?.trim();
  const completedDate = todo.completedDate
    ? formatDate(todo.completedDate)
    : null;

  return (
    <section
      className="grid gap-4 rounded-lg border border-(--border) bg-(--surface) p-4 text-(--text-h)"
      aria-label="Selected todo details"
    >
      <div className="grid gap-2">
        <h2 className="m-0 text-xl leading-tight">{todo.name}</h2>
        <TodoTypeBadge type={todo.type} />
      </div>

      <dl className="grid gap-4">
        <TodoDetailItem label="ID">{todo.id}</TodoDetailItem>
        <TodoDetailItem label="Date">{formatDate(todo.date)}</TodoDetailItem>
        <TodoDetailItem label="Completed">
          {completedDate ? (
            completedDate
          ) : (
            <span className="text-(--text-muted)">Open</span>
          )}
        </TodoDetailItem>
        <TodoDetailItem label="Description">
          <span className="whitespace-pre-wrap">
            {description || "No description provided."}
          </span>
        </TodoDetailItem>
      </dl>
    </section>
  );
}

export function TodosDataTable({
  deletingTodoId,
  hasActiveFilters,
  isLoading,
  onDeleteTodo,
  onTodoRowClick,
  selectedTodoId,
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
              onClick={(event) => {
                event.stopPropagation();
                onDeleteTodo(row.original.id);
              }}
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
      getRowId={(todo) => todo.id}
      isRowSelected={(todo) => todo.id === selectedTodoId}
      isLoading={isLoading}
      loadingMessage="Loading todos..."
      onRowClick={(todo) => onTodoRowClick(todo.id)}
    />
  );
}
