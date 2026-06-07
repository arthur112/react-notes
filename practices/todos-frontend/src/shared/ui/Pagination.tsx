type PaginationProps = {
  ariaLabel?: string;
  className?: string;
  itemLabel?: string;
  onPageChange: (page: number) => void;
  page: number;
  pageSize: number;
  total?: number;
};

const paginationClassName =
  "flex flex-col gap-3 text-sm text-(--text-muted) sm:flex-row sm:items-center sm:justify-between";

function cx(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

export function Pagination({
  ariaLabel = "Pagination",
  className,
  itemLabel = "item",
  onPageChange,
  page,
  pageSize,
  total,
}: PaginationProps) {
  const totalPages =
    total === undefined ? 1 : Math.max(1, Math.ceil(total / pageSize));
  const firstItem = total ? (page - 1) * pageSize + 1 : 0;
  const lastItem = total ? Math.min(page * pageSize, total) : 0;
  const itemText = total === 1 ? itemLabel : `${itemLabel}s`;
  const isPreviousDisabled = page <= 1 || total === undefined;
  const isNextDisabled = page >= totalPages || total === undefined;

  return (
    <nav
      className={cx(paginationClassName, className)}
      aria-label={ariaLabel}
    >
      <p className="m-0">
        {firstItem}-{lastItem} of {total ?? 0} {itemText}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <p className="m-0 min-w-24 text-center">
          Page {page} of {totalPages}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-(--border) bg-(--surface) px-3 text-sm font-medium text-(--text-h) disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPreviousDisabled}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-(--border) bg-(--surface) px-3 text-sm font-medium text-(--text-h) disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isNextDisabled}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </nav>
  );
}
