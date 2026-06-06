import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type TasksPaginationProps = {
  onPageChange: (page: number) => void;
  page: number;
  pageSize: number;
  total?: number;
};

export function TasksPagination({
  onPageChange,
  page,
  pageSize,
  total,
}: TasksPaginationProps) {
  const totalPages =
    total === undefined ? 1 : Math.max(1, Math.ceil(total / pageSize));
  const firstItem = total ? (page - 1) * pageSize + 1 : 0;
  const lastItem = total ? Math.min(page * pageSize, total) : 0;
  const isPreviousDisabled = page <= 1 || total === undefined;
  const isNextDisabled = page >= totalPages || total === undefined;

  return (
    <nav
      aria-label="Tasks pagination"
      className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
    >
      <p>
        {firstItem}-{lastItem} of {total ?? 0} tasks
      </p>

      <div className="flex items-center gap-2">
        <p className="min-w-24 text-center">
          Page {page} of {totalPages}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPreviousDisabled}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isNextDisabled}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}

