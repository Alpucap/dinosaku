import { Users, GraduationCap, Gamepad2 } from "lucide-react";
import React from "react";

export type Role = 'parents' | 'teacher' | 'children' | 'admin';

export const REGISTER_ROLES = [
    { id: 'parents' as Role, label: 'Orang Tua', icon: React.createElement(Users, { size: 32 }) },
    { id: 'teacher' as Role, label: 'Guru', icon: React.createElement(GraduationCap, { size: 32 }) },
    { id: 'children' as Role, label: 'Anak', icon: React.createElement(Gamepad2, { size: 32 }) },
];

export const ROLE_DASHBOARD: Record<Role, string> = {
    admin: '/admin',
    children: '/learn',
    parents: '/pembimbing',
    teacher: '/pembimbing',
};

export function getDashboardPath(role: Role): string {
    return ROLE_DASHBOARD[role] ?? '/dashboard';
}
