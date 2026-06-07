import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { MultiSelect, type MultiSelectOption } from "@ui/MultiSelect";
import { Pagination } from "@ui/Pagination";
import { SearchBar } from "@ui/SearchBar";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCreateTodo, type CreateTodoInput } from "../api/useCreateTodo";
import { useDeleteTodo } from "../api/useDeleteTodo";
import { useGetTodos } from "../api/useGetTodos";
import {
  todoTypeLabels,
  todoTypes,
  type TodoType,
} from "../types/todoTypes";
import { AddTodoForm, type AddTodoFormSubmitHelpers } from "../ui/AddTodoForm";
import { TodosDataTable } from "../ui/TodosDataTable";

const PAGE_SIZE = 20;

const todoTypeOptions: Array<MultiSelectOption<TodoType>> = todoTypes.map(
  (type) => ({
    label: todoTypeLabels[type],
    value: type,
  }),
);

const filterInputClassName =
  "h-9 w-full min-w-0 rounded-md border border-(--border) bg-(--surface) px-3 text-sm text-(--text-h) outline-none focus-visible:border-(--accent-border) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)";

function Root({ children }: { children: ReactNode }) {
  return <div className="grid gap-4">{children}</div>;
}

function Toolbar({ children }: { children: ReactNode }) {
  return <div className="grid gap-3">{children}</div>;
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
          className="flex items-center justify-between gap-3 rounded-lg border border-(--danger-border) bg-(--danger-bg) px-3 py-2 text-sm text-(--danger)"
          role="alert"
        >
          <span>{queryError.message}</span>
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-(--border) bg-(--surface) px-3 text-sm font-medium text-(--text-h) disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onRetry}
          >
            Retry
          </button>
        </div>
      ) : null}

      {mutationError ? (
        <p
          className="m-0 rounded-lg border border-(--danger-border) bg-(--danger-bg) px-3 py-2 text-sm text-(--danger)"
          role="alert"
        >
          {mutationError.message}
        </p>
      ) : null}
    </>
  );
}

const TodosTable = {
  alerts: Alerts,
  root: Root,
  toolbar: Toolbar,
} as const;

export function TodosTableContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilters, setTypeFilters] = useState<TodoType[]>([]);
  const [completedDateFrom, setCompletedDateFrom] = useState("");
  const [completedDateTo, setCompletedDateTo] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const hasActiveFilters =
    search.trim().length > 0 ||
    typeFilters.length > 0 ||
    completedDateFrom.length > 0 ||
    completedDateTo.length > 0;
  const todosQuery = useGetTodos({
    completedDateFrom,
    completedDateTo,
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
    types: typeFilters,
  });
  const createTodoMutation = useCreateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const todos = todosQuery.data?.todos ?? [];
  const deletingTodoId = deleteTodoMutation.isPending
    ? deleteTodoMutation.variables
    : undefined;
  const mutationError = createTodoMutation.error ?? deleteTodoMutation.error;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleTypeFiltersChange(values: TodoType[]) {
    setTypeFilters(values);
    setPage(1);
  }

  function handleCompletedDateFromChange(value: string) {
    setCompletedDateFrom(value);
    setPage(1);
  }

  function handleCompletedDateToChange(value: string) {
    setCompletedDateTo(value);
    setPage(1);
  }

  function handleClearFilters() {
    setSearch("");
    setTypeFilters([]);
    setCompletedDateFrom("");
    setCompletedDateTo("");
    setPage(1);
  }

  function handleAddTodo(
    values: CreateTodoInput,
    helpers: AddTodoFormSubmitHelpers,
  ) {
    createTodoMutation.mutate(values, {
      onSuccess: helpers.reset,
    });
  }

  return (
    <TodosTable.root>
      <TodosTable.toolbar>
        <div className="grid gap-2 md:grid-cols-[minmax(180px,1fr)_minmax(170px,220px)_minmax(300px,340px)_auto]">
          <SearchBar
            label="Search todos"
            value={search}
            onValueChange={handleSearchChange}
            placeholder="Search todos"
          />
          <MultiSelect
            label="Filter by type"
            values={typeFilters}
            onValuesChange={handleTypeFiltersChange}
            options={todoTypeOptions}
            placeholder="All types"
          />
          <div
            className="grid gap-2 sm:grid-cols-2"
            role="group"
            aria-label="Completed date range"
          >
            <label className="relative min-w-0">
              <span className="pointer-events-none absolute -top-2 left-2 bg-(--surface) px-1 text-[10px] leading-none font-medium text-(--text-muted) uppercase">
                Done from
              </span>
              <input
                type="date"
                className={filterInputClassName}
                value={completedDateFrom}
                max={completedDateTo || undefined}
                onChange={(event) =>
                  handleCompletedDateFromChange(event.target.value)
                }
                aria-label="Completed from"
              />
            </label>
            <label className="relative min-w-0">
              <span className="pointer-events-none absolute -top-2 left-2 bg-(--surface) px-1 text-[10px] leading-none font-medium text-(--text-muted) uppercase">
                Done to
              </span>
              <input
                type="date"
                className={filterInputClassName}
                value={completedDateTo}
                min={completedDateFrom || undefined}
                onChange={(event) =>
                  handleCompletedDateToChange(event.target.value)
                }
                aria-label="Completed to"
              />
            </label>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--text-h) disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasActiveFilters}
            onClick={handleClearFilters}
            aria-label="Clear todo filters"
          >
            <X className="size-4" />
          </button>
        </div>
        <AddTodoForm
          isSubmitting={createTodoMutation.isPending}
          onSubmit={handleAddTodo}
        />
      </TodosTable.toolbar>

      <TodosTable.alerts
        queryError={todosQuery.error}
        mutationError={mutationError}
        onRetry={() => {
          void todosQuery.refetch();
        }}
      />

      <TodosDataTable
        todos={todos}
        isLoading={todosQuery.isLoading}
        hasActiveFilters={hasActiveFilters}
        deletingTodoId={deletingTodoId}
        onDeleteTodo={deleteTodoMutation.mutate}
      />

      <Pagination
        ariaLabel="Todos pagination"
        itemLabel="todo"
        page={page}
        pageSize={PAGE_SIZE}
        total={todosQuery.data?.total}
        onPageChange={setPage}
      />
    </TodosTable.root>
  );
}
