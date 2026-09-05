import { createRootRoute, Outlet } from "@tanstack/react-router";

function RootLayout() {
  return (
    <main className="flex flex-col items-center">
      <Outlet />
    </main>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
