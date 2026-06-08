export type TodoType = string;

export type Todo = {
  completedDate: string | null;
  description: string | null;
  id: number;
  name: string;
  date: string;
  type: TodoType;
};

export function formatTodoTypeLabel(type: TodoType): string {
  const label = type
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();

  if (!label) {
    return "Unknown";
  }

  return label
    .split(/\s+/)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");
}
