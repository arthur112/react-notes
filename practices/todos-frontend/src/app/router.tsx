import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TodosPage } from "@/features/todos";
import { RootLayout } from "./RootLayout";
import { AboutPage } from "./pages/AboutPage";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const todosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: TodosPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([todosRoute, aboutRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
