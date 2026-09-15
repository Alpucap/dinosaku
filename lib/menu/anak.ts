import {
  LayoutDashboard,
  BookOpen,
  Target,
  PiggyBank,
  Trophy,
  UserRound,
} from "lucide-react";
import type { SidebarMenuSection } from "@/components/layout/AppSidebar";

export const anakMenuSections: SidebarMenuSection[] = [
  {
    items: [{ name: "Beranda", href: "/anak", icon: LayoutDashboard }],
  },
  {
    title: "Petualanganmu",
    items: [
      { name: "Baca Komik", href: "/anak/komik", icon: BookOpen },
      { name: "Misi Harian", href: "/anak/misi", icon: Target },
      { name: "Celenganku", href: "/anak/celengan", icon: PiggyBank },
    ],
  },
  {
    title: "Koleksimu",
    items: [
      { name: "Lencana & Piala", href: "/anak/lencana", icon: Trophy },
      { name: "Profilku", href: "/anak/profil", icon: UserRound },
    ],
  },
];

export const anakRootHrefs = ["/anak"];
