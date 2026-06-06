import { TasksTableContainer } from "../containers/TasksTableContainer";

export function TasksPage() {
  return (
    <>
      <header className="mb-6 flex items-end justify-between gap-4 text-left">
        <h1 className="m-0">Tasks</h1>
      </header>
      <TasksTableContainer />
    </>
  );
}

