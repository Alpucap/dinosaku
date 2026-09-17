import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Target,
  PiggyBank,
  BookOpen,
} from "lucide-react";
import type { SidebarMenuSection } from "@/components/layout/AppSidebar";

export const pembimbingMenuSections: SidebarMenuSection[] = [
  {
    items: [
      { name: "Dasbor", href: "/pembimbing", icon: LayoutDashboard },
      { name: "Progres Belajar", href: "/pembimbing/progres", icon: TrendingUp },
      { name: "Daftar Anak", href: "/pembimbing/anak", icon: Users },
      { name: "Aksi & Misi", href: "/pembimbing/aksi", icon: Target },
      { name: "Target Tabungan", href: "/pembimbing/tabungan", icon: PiggyBank },
      { name: "Koleksi Cerita", href: "/pembimbing/koleksi", icon: BookOpen },
    ],
  },
];

export const pembimbingRootHrefs = ["/pembimbing"];
