import {
  LayoutDashboard,
  TrendingUp,
  Users,
  PiggyBank,
  Settings,
  BookOpen,
} from "lucide-react";
import type { SidebarMenuSection } from "@/components/layout/AppSidebar";

export const pembimbingMenuSections: SidebarMenuSection[] = [
  {
    items: [{ name: "Dasbor", href: "/pembimbing", icon: LayoutDashboard }],
  },
  {
    title: "Pantau",
    items: [
      { name: "Progres Belajar", href: "/pembimbing/progres", icon: TrendingUp },
      { name: "Daftar Anak", href: "/pembimbing/anak", icon: Users },
      { name: "Aksi & Misi", href: "/pembimbing/aksi", icon: PiggyBank },
      { name: "Koleksi Cerita", href: "/pembimbing/koleksi", icon: BookOpen },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { name: "Pengaturan", href: "/pembimbing/pengaturan", icon: Settings },
    ],
  },
];

export const pembimbingRootHrefs = ["/pembimbing"];
