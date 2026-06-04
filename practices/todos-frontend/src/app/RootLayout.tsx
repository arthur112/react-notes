import { Link, Outlet } from "@tanstack/react-router";

export function RootLayout() {
  return (
    <main className="box-border min-h-svh px-4 py-7 min-[641px]:px-6 min-[641px]:py-12">
      <section className="mx-auto w-[min(100%,960px)]">
        <nav aria-label="Main navigation" className="mb-8 flex flex-wrap gap-2">
          <NavLink to="/">Todos</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <Outlet />
      </section>
    </main>
  );
}

function NavLink({ to, children }: { to: "/" | "/about"; children: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="rounded-md border px-3 py-2 text-sm font-medium transition-colors"
      activeProps={{
        className:
          "border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)]",
      }}
      inactiveProps={{
        className:
          "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text-h)]",
      }}
    >
      {children}
    </Link>
  );
}
