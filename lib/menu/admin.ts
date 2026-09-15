import {
  LayoutDashboard,
  Users,
  BookOpen,
  Target,
  CreditCard,
  Settings,
} from "lucide-react";
import type { SidebarMenuSection } from "@/components/layout/AppSidebar";

export const adminMenuSections: SidebarMenuSection[] = [
  {
    items: [{ name: "Dasbor", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Konten",
    items: [
      { name: "Komik & Cerita", href: "/admin/komik", icon: BookOpen },
      { name: "Misi & Tantangan", href: "/admin/misi", icon: Target },
    ],
  },
  {
    title: "Pengelolaan",
    items: [
      { name: "Pengguna", href: "/admin/pengguna", icon: Users },
      { name: "Langganan", href: "/admin/langganan", icon: CreditCard },
      { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
    ],
  },
];

export const adminRootHrefs = ["/admin"];
