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
      className="grid min-w-0 grid-cols-1 items-center gap-2 min-[561px]:grid-cols-[1fr_150px_auto] min-[841px]:flex"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="box-border min-h-10.5 w-full min-w-0 rounded-lg border border-(--border) bg-(--surface) px-3 text-[15px] text-(--text-h) outline-0 [font:inherit] min-[841px]:w-55"
        value={todoName}
        onChange={(event) => setTodoName(event.target.value)}
        placeholder="New todo"
        aria-label="New todo"
      />
      <input
        type="date"
        className="box-border min-h-10.5 w-full min-w-0 rounded-lg border border-(--border) bg-(--surface) px-3 text-[15px] text-(--text-h) outline-0 [font:inherit] min-[841px]:w-37.5"
        value={todoDate}
        onChange={(event) => setTodoDate(event.target.value)}
        aria-label="Todo date"
      />
      <button
        type="submit"
        className="inline-flex min-h-10.5 w-full cursor-pointer items-center justify-center rounded-lg border border-(--accent-border) bg-(--accent-bg) px-3 text-sm font-[650] text-(--accent) disabled:cursor-not-allowed disabled:opacity-[0.55] min-[561px]:w-auto"
        disabled={isSubmitting || !todoName.trim()}
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
