import {
  LayoutDashboard,
  BookOpen,
  Map,
  Medal,
  Trophy,
  Pencil,
  Wallet,
  Target,
  GraduationCap,
} from "lucide-react";
import type { SidebarMenuSection } from "@/components/layout/AppSidebar";

export const learnMenuSections: SidebarMenuSection[] = [
  {
    items: [
      { name: "Dasbor", href: "/learn/dasbor", icon: LayoutDashboard },
      { name: "Petualangan", href: "/learn", icon: Map },
      { name: "Kelasku", href: "/learn/kelas", icon: GraduationCap },
      { name: "Buat Cerita", href: "/learn/create", icon: Pencil },
      { name: "Koleksi", href: "/learn/collection", icon: BookOpen },
      { name: "Lencana", href: "/learn/badges", icon: Medal },
      { name: "Peringkat", href: "/learn/leaderboard", icon: Trophy },
      { name: "Dompet", href: "/learn/tracker", icon: Wallet },
      { name: "Impianku", href: "/learn/impian", icon: Target },
    ],
  },
];

export const learnRootHrefs = ["/learn"];
