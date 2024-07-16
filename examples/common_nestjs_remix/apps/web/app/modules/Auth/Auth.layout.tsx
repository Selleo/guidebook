import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <main className="p-4">
      <Outlet />
    </main>
  );
}
