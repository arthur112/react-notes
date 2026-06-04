import { TodosTableContainer } from "../containers/TodosTableContainer";

export function TodosPage() {
  return (
    <>
      <header className="mb-6 flex items-end justify-between gap-4 text-left">
        <h1 className="m-0">Todos</h1>
      </header>
      <TodosTableContainer />
    </>
  );
}
