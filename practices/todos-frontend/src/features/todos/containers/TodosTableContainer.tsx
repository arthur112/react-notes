import { useState, type ReactNode } from "react";
import { Pagination } from "@ui/Pagination";
import { SearchBar } from "@ui/SearchBar";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCreateTodo, type CreateTodoInput } from "../api/useCreateTodo";
import { useDeleteTodo } from "../api/useDeleteTodo";
import { useGetTodos } from "../api/useGetTodos";
import { AddTodoForm, type AddTodoFormSubmitHelpers } from "../ui/AddTodoForm";
import { TodosDataTable } from "../ui/TodosDataTable";

const PAGE_SIZE = 20;

function Root({ children }: { children: ReactNode }) {
  return <div className="grid gap-4">{children}</div>;
}

function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
      {children}
    </div>
  );
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
  const debouncedSearch = useDebounce(search, 300);
  const todosQuery = useGetTodos({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
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
        <SearchBar
          label="Search todos"
          value={search}
          onValueChange={handleSearchChange}
          placeholder="Search todos"
        />
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
        search={search}
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
