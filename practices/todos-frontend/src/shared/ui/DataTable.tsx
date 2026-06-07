import {
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";

export type DataTableColumnMeta = {
  cellClassName?: string;
  headerClassName?: string;
};

export type DataTableProps<TData extends RowData> = {
  className?: string;
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyMessage?: ReactNode;
  getRowId?: (row: TData) => number | string;
  isRowSelected?: (row: TData) => boolean;
  isLoading?: boolean;
  loadingMessage?: ReactNode;
  manualSorting?: boolean;
  onRowClick?: (row: TData) => void;
  onSortingChange?: OnChangeFn<SortingState>;
  sorting?: SortingState;
};

function cx(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

function getColumnMeta(meta: unknown): DataTableColumnMeta {
  return (meta ?? {}) as DataTableColumnMeta;
}

function getSortIndicator(sortDirection: false | "asc" | "desc"): string {
  if (sortDirection === "asc") {
    return "\u2191";
  }

  if (sortDirection === "desc") {
    return "\u2193";
  }

  return "";
}

function getAriaSort(
  sortDirection: false | "asc" | "desc",
): "ascending" | "descending" | undefined {
  if (sortDirection === "asc") {
    return "ascending";
  }

  if (sortDirection === "desc") {
    return "descending";
  }

  return undefined;
}

function isInteractiveElement(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest(
      "a, button, input, select, textarea, [role='button'], [role='link']",
    ),
  );
}

export function DataTable<TData extends RowData>({
  className,
  columns,
  data,
  emptyMessage = "No records found.",
  getRowId,
  isRowSelected,
  isLoading = false,
  loadingMessage = "Loading...",
  manualSorting = false,
  onRowClick,
  onSortingChange,
  sorting,
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const isSortingControlled = sorting !== undefined;
  const resolvedSorting = sorting ?? internalSorting;
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    if (!isSortingControlled) {
      setInternalSorting(updater);
    }

    onSortingChange?.(updater);
  };

  function handleRowClick(event: MouseEvent<HTMLTableRowElement>, row: TData) {
    if (!onRowClick || isInteractiveElement(event.target)) {
      return;
    }

    onRowClick(row);
  }

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    row: TData,
  ) {
    if (!onRowClick || isInteractiveElement(event.target)) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  }

  // TanStack Table returns imperative helpers that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: resolvedSorting,
    },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    manualSorting,
  });
  const columnCount = Math.max(table.getVisibleLeafColumns().length, 1);

  return (
    <div
      className={cx(
        "w-full overflow-x-auto rounded-lg border border-(--border) bg-(--surface) text-(--text-h)",
        className,
      )}
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDirection = header.column.getIsSorted();
                const meta = getColumnMeta(header.column.columnDef.meta);

                return (
                  <th
                    key={header.id}
                    aria-sort={getAriaSort(sortDirection)}
                    className={cx(
                      "border-b border-(--border) px-4 py-3 align-middle text-xs font-semibold uppercase text-(--text-muted)",
                      meta.headerClassName ?? "text-left",
                    )}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="inline-flex h-7 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-inherit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                        <span aria-hidden="true">
                          {getSortIndicator(sortDirection)}
                        </span>
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="last:[&>td]:border-b-0">
              <td
                className="border-b border-(--border) px-4 py-6 text-center align-middle text-(--text-muted)"
                colSpan={columnCount}
              >
                {loadingMessage}
              </td>
            </tr>
          ) : null}

          {!isLoading && table.getRowModel().rows.length === 0 ? (
            <tr className="last:[&>td]:border-b-0">
              <td
                className="border-b border-(--border) px-4 py-6 text-center align-middle text-(--text-muted)"
                colSpan={columnCount}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : null}

          {table.getRowModel().rows.map((row) => {
            const rowData = row.original;
            const rowKey = String(getRowId?.(rowData) ?? row.id);
            const selected = isRowSelected?.(rowData) ?? false;

            return (
              <tr
                key={rowKey}
                aria-selected={selected || undefined}
                className={cx(
                  "last:[&>td]:border-b-0",
                  onRowClick
                    ? "cursor-pointer transition-colors hover:bg-(--accent-bg) focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--accent-border)"
                    : undefined,
                  selected ? "bg-(--accent-bg)" : undefined,
                )}
                data-state={selected ? "selected" : undefined}
                onClick={
                  onRowClick
                    ? (event) => handleRowClick(event, rowData)
                    : undefined
                }
                onKeyDown={
                  onRowClick
                    ? (event) => handleRowKeyDown(event, rowData)
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = getColumnMeta(cell.column.columnDef.meta);

                  return (
                    <td
                      key={cell.id}
                      className={cx(
                        "border-b border-(--border) px-4 py-3 align-middle text-(--text-h)",
                        meta.cellClassName,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
