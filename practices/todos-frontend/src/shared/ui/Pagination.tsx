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
  "flex w-[min(100%,1040px)] flex-col gap-2 text-sm text-(--text-muted) min-[561px]:flex-row min-[561px]:items-center min-[561px]:justify-between";

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

      <div className="flex flex-col gap-2 min-[421px]:flex-row min-[421px]:items-center">
        <p className="m-0 min-w-24 text-(--text-muted) min-[421px]:text-center">
          Page {page} of {totalPages}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="inline-flex min-h-8.5 cursor-pointer items-center justify-center rounded-lg border border-(--border) bg-(--surface) px-3 text-sm font-[650] text-(--text-h) disabled:cursor-not-allowed disabled:opacity-[0.55]"
            disabled={isPreviousDisabled}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="inline-flex min-h-8.5 cursor-pointer items-center justify-center rounded-lg border border-(--border) bg-(--surface) px-3 text-sm font-[650] text-(--text-h) disabled:cursor-not-allowed disabled:opacity-[0.55]"
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
