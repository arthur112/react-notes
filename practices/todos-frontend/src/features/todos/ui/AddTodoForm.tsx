import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import {
  todoTypeLabels,
  todoTypes,
  type TodoType,
} from "../types/todoTypes";

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
  onSubmit: (
    values: AddTodoFormValues,
    helpers: AddTodoFormSubmitHelpers,
  ) => void;
};

const inputClassName =
  "h-9 min-w-0 rounded-md border border-(--border) bg-(--surface) px-3 text-sm text-(--text-h) outline-none placeholder:text-(--text-muted) focus-visible:border-(--accent-border) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)";

function getTodayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddTodoForm({ isSubmitting, onSubmit }: AddTodoFormProps) {
  const [todoName, setTodoName] = useState("");
  const [todoDate, setTodoDate] = useState(getTodayInputValue);
  const [todoType, setTodoType] = useState<TodoType>("feature");
  const [todoCompletedDate, setTodoCompletedDate] = useState("");

  function resetForm() {
    setTodoName("");
    setTodoDate(getTodayInputValue());
    setTodoType("feature");
    setTodoCompletedDate("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = todoName.trim();

    if (!name) {
      return;
    }

    onSubmit(
      {
        completedDate: todoCompletedDate || null,
        name,
        date: todoDate || getTodayInputValue(),
        type: todoType,
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
        value={todoType}
        onChange={(event) => setTodoType(event.target.value as TodoType)}
      >
        {todoTypes.map((type) => (
          <option key={type} value={type}>
            {todoTypeLabels[type]}
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
        disabled={isSubmitting || !todoName.trim()}
      >
        <Plus className="size-4" />
        <span className="ml-2">{isSubmitting ? "Adding" : "Add todo"}</span>
      </button>
    </form>
  );
}
