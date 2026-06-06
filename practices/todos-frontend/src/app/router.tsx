import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TasksPage } from "@/features/tasks";
import { TodosPage } from "@/features/todos";
import { RootLayout } from "./RootLayout";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const todosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: TodosPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks",
  component: TasksPage,
});

const routeTree = rootRoute.addChildren([todosRoute, tasksRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
