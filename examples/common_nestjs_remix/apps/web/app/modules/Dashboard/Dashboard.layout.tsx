import { Outlet } from "@remix-run/react";

export default function DashboardLayout() {
  return (
    <div>
      <h1>Dashboard Layout lol</h1>
      <Outlet />
    </div>
  );
}
