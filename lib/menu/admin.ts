import {
  LayoutDashboard,
  Users,
} from "lucide-react";
import type { SidebarMenuSection } from "@/components/layout/AppSidebar";

export const adminMenuSections: SidebarMenuSection[] = [
  {
    items: [
      { name: "Dasbor", href: "/admin", icon: LayoutDashboard },
      { name: "Pengguna", href: "/admin/pengguna", icon: Users },
    ],
  },
];

export const adminRootHrefs = ["/admin"];
