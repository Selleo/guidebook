import { Users as UsersIcon } from "lucide-react";
import { Link } from "react-router";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

type NavAdminProps = {
  isAdmin: boolean;
  currentPath: string;
};

export function NavAdmin({ isAdmin, currentPath }: NavAdminProps) {
  if (!isAdmin) {
    return null;
  }

  const isUsersRoute = currentPath.startsWith("/dashboard/admin");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Users" isActive={isUsersRoute}>
            <Link to="/dashboard/admin/users">
              <UsersIcon className="size-4" />
              <span>Users</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
