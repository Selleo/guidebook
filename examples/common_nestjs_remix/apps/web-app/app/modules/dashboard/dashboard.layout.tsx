import { Outlet } from "react-router";

import { AppSidebar } from "~/components/app-sidebar";
import { useCurrentUser } from "~/api/queries/useCurrentUser";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export type DashboardOutletContext = {
  currentUser: ReturnType<typeof useCurrentUser>["data"];
};

export default function DashboardLayout() {
  const {
    data: currentUser,
    isLoading,
    isError,
    error,
  } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center p-6 text-sm text-muted-foreground">
        Loading dashboard…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center p-6 text-sm text-destructive">
        {error?.message || "Unable to load dashboard."}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet context={{ currentUser }} />
      </SidebarInset>
    </SidebarProvider>
  );
}
