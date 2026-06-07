import { useState, type FormEvent } from "react";

export type AddTodoFormValues = {
  date: string;
  name: string;
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

  function resetForm() {
    setTodoName("");
    setTodoDate(getTodayInputValue());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = todoName.trim();

    if (!name) {
      return;
    }

    onSubmit(
      {
        name,
        date: todoDate || getTodayInputValue(),
      },
      { reset: resetForm },
    );
  }

  return (
    <form
      className="grid min-w-0 gap-2 md:flex md:items-center"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className={`${inputClassName} w-full md:w-56`}
        value={todoName}
        onChange={(event) => setTodoName(event.target.value)}
        placeholder="New todo"
        aria-label="New todo"
      />
      <input
        type="date"
        className={`${inputClassName} w-full md:w-40`}
        value={todoDate}
        onChange={(event) => setTodoDate(event.target.value)}
        aria-label="Todo date"
      />
      <button
        type="submit"
        className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-md border border-(--accent-border) bg-(--accent-bg) px-3 text-sm font-medium text-(--accent) disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        disabled={isSubmitting || !todoName.trim()}
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
