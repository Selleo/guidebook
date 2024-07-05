import { Outlet } from "@remix-run/react";
import { useAuthEffect } from "../Auth/authEffect";
import { authGuard } from "../Auth/authGuard";

export function clientLoader() {
  authGuard();
}

export default function DashboardLayout() {
  useAuthEffect();

  return (
    <div>
      <h1>Dashboard Layout</h1>
      <Outlet />
    </div>
  );
}
