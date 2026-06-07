export const todoTypes = [
  "feature",
  "bug",
  "chore",
  "documentation",
] as const;

export type TodoType = (typeof todoTypes)[number];

export const todoTypeLabels: Record<TodoType, string> = {
  feature: "Feature",
  bug: "Bug",
  chore: "Chore",
  documentation: "Documentation",
};

export type Todo = {
  completedDate: string | null;
  description: string | null;
  id: number;
  name: string;
  date: string;
  type: TodoType;
};
