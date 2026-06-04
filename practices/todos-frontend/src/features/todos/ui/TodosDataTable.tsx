import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { Todo } from "../types/todoTypes";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const columns: ColumnDef<Todo>[] = [
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
];

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

function getSortIndicator(sortDirection: false | "asc" | "desc"): string {
  if (sortDirection === "asc") {
    return "↑";
  }

  if (sortDirection === "desc") {
    return "↓";
  }

  return "";
}

export function TodosDataTable({
  deletingTodoId,
  isLoading,
  onDeleteTodo,
  search,
  todos,
}: TodosDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // TanStack Table returns imperative helpers that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: todos,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-[min(100%,1040px)] overflow-x-auto rounded-lg border border-(--border) bg-(--surface)">
      <table className="w-full border-collapse text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-(--border) px-4.5 py-3.5 text-left align-middle text-[13px] font-[650] uppercase text-(--text-muted)"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className="inline-flex min-h-7 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-inherit [font:inherit] [text-transform:inherit] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--accent)"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>
                      <span aria-hidden="true">
                        {getSortIndicator(header.column.getIsSorted())}
                      </span>
                    </button>
                  )}
                </th>
              ))}
              <th className="w-25 border-b border-(--border) px-4.5 py-3.5 text-right align-middle text-[13px] font-[650] uppercase text-(--text-muted)">
                Action
              </th>
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="last:[&>td]:border-b-0">
              <td
                className="border-b border-(--border) px-4.5 py-3.5 text-center align-middle text-[15px] text-(--text-muted)"
                colSpan={columns.length + 1}
              >
                Loading todos...
              </td>
            </tr>
          ) : null}

          {!isLoading && table.getRowModel().rows.length === 0 ? (
            <tr className="last:[&>td]:border-b-0">
              <td
                className="border-b border-(--border) px-4.5 py-3.5 text-center align-middle text-[15px] text-(--text-muted)"
                colSpan={columns.length + 1}
              >
                {search.trim() ? "No todos match your search." : "No todos yet."}
              </td>
            </tr>
          ) : null}

          {table.getRowModel().rows.map((row) => {
            const isDeleting = deletingTodoId === row.original.id;

            return (
              <tr key={row.id} className="last:[&>td]:border-b-0">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b border-(--border) px-4.5 py-3.5 align-middle text-[15px] text-(--text-h)"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="border-b border-(--border) px-4.5 py-3.5 text-right align-middle text-[15px] text-(--text-h)">
                  <button
                    type="button"
                    className="inline-flex min-h-8.5 w-full cursor-pointer items-center justify-center rounded-lg border border-(--border) bg-(--surface) px-3 text-sm font-[650] text-(--danger) disabled:cursor-not-allowed disabled:opacity-[0.55] min-[561px]:w-auto"
                    disabled={isDeleting}
                    onClick={() => onDeleteTodo(row.original.id)}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
