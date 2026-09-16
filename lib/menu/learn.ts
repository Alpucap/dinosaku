import {
  BookOpen,
  Map,
  Medal,
  Trophy,
  Pencil,
  Wallet,
  GraduationCap,
} from "lucide-react";
import type { SidebarMenuSection } from "@/components/layout/AppSidebar";

export const learnMenuSections: SidebarMenuSection[] = [
  {
    items: [
      { name: "Petualangan", href: "/learn", icon: Map },
      { name: "Buat Cerita", href: "/learn/create", icon: Pencil },
      { name: "Koleksi", href: "/learn/collection", icon: BookOpen },
      { name: "Lencana", href: "/learn/badges", icon: Medal },
      { name: "Peringkat", href: "/learn/leaderboard", icon: Trophy },
      { name: "Dompet", href: "/learn/tracker", icon: Wallet },
      { name: "Kelasku", href: "/learn/kelas", icon: GraduationCap },
    ],
  },
];

export const learnRootHrefs = ["/learn"];
