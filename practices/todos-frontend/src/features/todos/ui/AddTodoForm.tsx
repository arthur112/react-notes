import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import type { MultiSelectOption } from "@ui/MultiSelect";
import type { TodoType } from "../types/todoModels";

export type AddTodoFormValues = {
  completedDate: string | null;
  date: string;
  name: string;
  type: TodoType;
};

export type AddTodoFormSubmitHelpers = {
  reset: () => void;
};

type AddTodoFormProps = {
  isSubmitting: boolean;
  isTodoTypesLoading: boolean;
  onSubmit: (
    values: AddTodoFormValues,
    helpers: AddTodoFormSubmitHelpers,
  ) => void;
  todoTypeOptions: Array<MultiSelectOption<TodoType>>;
};

const inputClassName =
  "h-9 min-w-0 rounded-md border border-(--border) bg-(--surface) px-3 text-sm text-(--text-h) outline-none placeholder:text-(--text-muted) focus-visible:border-(--accent-border) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)";

function getTodayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddTodoForm({
  isSubmitting,
  isTodoTypesLoading,
  onSubmit,
  todoTypeOptions,
}: AddTodoFormProps) {
  const [todoName, setTodoName] = useState("");
  const [todoDate, setTodoDate] = useState(getTodayInputValue);
  const [todoType, setTodoType] = useState<TodoType>("");
  const [todoCompletedDate, setTodoCompletedDate] = useState("");
  const defaultTodoType = todoTypeOptions[0]?.value ?? "";
  const selectedTodoType = todoTypeOptions.some(
    (option) => option.value === todoType,
  )
    ? todoType
    : defaultTodoType;

  function resetForm() {
    setTodoName("");
    setTodoDate(getTodayInputValue());
    setTodoType("");
    setTodoCompletedDate("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = todoName.trim();

    if (!name || !selectedTodoType) {
      return;
    }

    onSubmit(
      {
        completedDate: todoCompletedDate || null,
        name,
        date: todoDate || getTodayInputValue(),
        type: selectedTodoType,
      },
      { reset: resetForm },
    );
  }

  return (
    <form
      className="grid min-w-0 gap-2 md:grid-cols-[minmax(180px,1fr)_150px_150px_150px_auto]"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="todo-name">
        New todo
      </label>
      <input
        id="todo-name"
        type="text"
        className={inputClassName}
        value={todoName}
        onChange={(event) => setTodoName(event.target.value)}
        placeholder="New todo"
      />
      <label className="sr-only" htmlFor="todo-date">
        Todo date
      </label>
      <input
        id="todo-date"
        type="date"
        className={inputClassName}
        value={todoDate}
        onChange={(event) => setTodoDate(event.target.value)}
      />
      <label className="sr-only" htmlFor="todo-type">
        Todo type
      </label>
      <select
        id="todo-type"
        className={inputClassName}
        value={selectedTodoType}
        disabled={isTodoTypesLoading || todoTypeOptions.length === 0}
        onChange={(event) => setTodoType(event.target.value)}
      >
        {todoTypeOptions.length === 0 ? (
          <option value="">
            {isTodoTypesLoading ? "Loading types" : "No types available"}
          </option>
        ) : null}
        {todoTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="todo-completed-date">
        Completed date
      </label>
      <input
        id="todo-completed-date"
        type="date"
        className={inputClassName}
        value={todoCompletedDate}
        onChange={(event) => setTodoCompletedDate(event.target.value)}
      />
      <button
        type="submit"
        className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-md border border-(--accent-border) bg-(--accent-bg) px-3 text-sm font-medium text-(--accent) disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        disabled={isSubmitting || !todoName.trim() || !selectedTodoType}
      >
        <Plus className="size-4" />
        <span className="ml-2">{isSubmitting ? "Adding" : "Add todo"}</span>
      </button>
    </form>
  );
}
