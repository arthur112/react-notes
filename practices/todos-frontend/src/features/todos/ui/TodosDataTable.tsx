import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type DataTableColumnMeta } from "@ui/DataTable";
import type { Todo } from "../types/todoTypes";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type TodosDataTableProps = {
  deletingTodoId?: Todo["id"];
  isLoading: boolean;
  onDeleteTodo: (todoId: Todo["id"]) => void;
  search: string;
  todos: Todo[];
};

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
}

export function TodosDataTable({
  deletingTodoId,
  isLoading,
  onDeleteTodo,
  search,
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
              className="inline-flex min-h-8.5 w-full cursor-pointer items-center justify-center rounded-lg border border-(--border) bg-(--surface) px-3 text-sm font-[650] text-(--danger) disabled:cursor-not-allowed disabled:opacity-[0.55] min-[561px]:w-auto"
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
        search.trim() ? "No todos match your search." : "No todos yet."
      }
      isLoading={isLoading}
      loadingMessage="Loading todos..."
    />
  );
}
