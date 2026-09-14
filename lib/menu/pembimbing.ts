import {
  LayoutDashboard,
  TrendingUp,
  Users,
  PiggyBank,
  FileText,
  Settings,
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
      { name: "Target Tabungan", href: "/pembimbing/tabungan", icon: PiggyBank },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { name: "Laporan", href: "/pembimbing/laporan", icon: FileText },
      { name: "Pengaturan", href: "/pembimbing/pengaturan", icon: Settings },
    ],
  },
];

export const pembimbingRootHrefs = ["/pembimbing"];
