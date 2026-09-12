import { Role } from "@/lib/constants/roles";

export type UserStatus = 'active' | 'inactive' | 'suspended';
export type SubscriptionPlan = 'free' | 'premium';

export interface User {
    id: string;
    email: string;
    password: string; // untuk dummy
    fullName: string;
    username: string;
    role: Role;
    avatarUrl?: string;
    status: UserStatus;
    plan: SubscriptionPlan;
    createdAt: string;
    lastLoginAt?: string;
    preferences: {
        notificationsEnabled: boolean;
    };
    childrenIds?: string[];
    parentId?: string;
    schoolCode?: string;
}

export const DUMMY_USERS: User[] = [
    // 1. ADMINISTRATOR
    {
        id: "usr_admin_001",
        email: "admin@dinosaku.com",
        username: "superadmin",
        password: "password123",
        fullName: "Administrator Dinosaku",
        role: "admin",
        status: "active",
        plan: "premium",
        avatarUrl: "/mascot/dino.png",
        createdAt: "2024-01-01T00:00:00Z",
        lastLoginAt: "2026-09-12T08:00:00Z",
        preferences: { notificationsEnabled: true }
    },

    // 2. ORANG TUA
    {
        id: "usr_parent_001",
        email: "ortu@dinosaku.com",
        username: "budi_ortu",
        password: "password123",
        fullName: "Budi Santoso",
        role: "parents",
        status: "active",
        plan: "premium",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
        createdAt: "2024-05-10T10:30:00Z",
        preferences: { notificationsEnabled: true },
        childrenIds: ["usr_child_001", "usr_child_002"]
    },

    // 3. ANAK PERTAMA (Terhubung ke Budi)
    {
        id: "usr_child_001",
        email: "anak1@dinosaku.com",
        username: "charlotte_s",
        password: "password123",
        fullName: "Charlotte Santoso",
        role: "children",
        status: "active",
        plan: "premium",
        avatarUrl: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Charlotte",
        createdAt: "2024-05-10T10:35:00Z",
        preferences: { notificationsEnabled: false },
        parentId: "usr_parent_001"
    },

    // 4. ANAK KEDUA (Terhubung ke Budi)
    {
        id: "usr_child_002",
        email: "anak2@dinosaku.com",
        username: "dina_s",
        password: "password123",
        fullName: "Dina Santoso",
        role: "children",
        status: "active",
        plan: "premium",
        avatarUrl: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Dina",
        createdAt: "2024-05-10T10:40:00Z",
        preferences: { notificationsEnabled: false },
        parentId: "usr_parent_001"
    },

    // 5. GURU
    {
        id: "usr_teacher_001",
        email: "guru@dinosaku.com",
        username: "bu_siti",
        password: "password123",
        fullName: "Siti Aminah, S.Pd",
        role: "teacher",
        status: "active",
        plan: "premium",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
        createdAt: "2024-08-01T07:15:00Z",
        preferences: { notificationsEnabled: true },
        schoolCode: "SDN-01-JKT"
    }
];
