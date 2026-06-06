import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { taskPriorities, type TaskPriority } from "../types/taskTypes";

export type AddTaskFormValues = {
  dueDate: string;
  owner: string;
  priority: TaskPriority;
  title: string;
};

export type AddTaskFormSubmitHelpers = {
  reset: () => void;
};

type AddTaskFormProps = {
  isSubmitting: boolean;
  onSubmit: (
    values: AddTaskFormValues,
    helpers: AddTaskFormSubmitHelpers,
  ) => void;
};

const inputClassName =
  "h-9 min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

function getTodayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddTaskForm({ isSubmitting, onSubmit }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState(getTodayInputValue);
  const [priority, setPriority] = useState<TaskPriority>("medium");

  function resetForm() {
    setTitle("");
    setOwner("");
    setDueDate(getTodayInputValue());
    setPriority("medium");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onSubmit(
      {
        title: trimmedTitle,
        owner,
        dueDate,
        priority,
      },
      { reset: resetForm },
    );
  }

  return (
    <form
      className="grid gap-2 md:grid-cols-[minmax(180px,1fr)_minmax(130px,0.7fr)_140px_120px_auto]"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="task-title">
        Task title
      </label>
      <input
        id="task-title"
        className={inputClassName}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="New task"
      />

      <label className="sr-only" htmlFor="task-owner">
        Owner
      </label>
      <input
        id="task-owner"
        className={inputClassName}
        value={owner}
        onChange={(event) => setOwner(event.target.value)}
        placeholder="Owner"
      />

      <label className="sr-only" htmlFor="task-due-date">
        Due date
      </label>
      <input
        id="task-due-date"
        className={inputClassName}
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <label className="sr-only" htmlFor="task-priority">
        Priority
      </label>
      <select
        id="task-priority"
        className={inputClassName}
        value={priority}
        onChange={(event) => setPriority(event.target.value as TaskPriority)}
      >
        {taskPriorities.map((taskPriority) => (
          <option key={taskPriority} value={taskPriority}>
            {priorityLabels[taskPriority]}
          </option>
        ))}
      </select>

      <Button
        type="submit"
        className="w-full md:w-auto"
        disabled={isSubmitting || !title.trim()}
      >
        <Plus />
        {isSubmitting ? "Adding" : "Add task"}
      </Button>
    </form>
  );
}

