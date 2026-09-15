import { Role } from "@/lib/constants/roles";

export type UserStatus = 'active' | 'inactive' | 'suspended';
export type SubscriptionPlan = 'free' | 'premium';

export interface UserBadge {
    id: string;
    icon: string;
    title: string;
    description: string;
    unlocked: boolean;
}

export interface User {
    id: string;
    email: string;
    password: string;
    fullName: string;
    username: string;
    role: Role;
    avatarUrl?: string;
    status: UserStatus;
    plan?: SubscriptionPlan;
    classCode?: string;
    createdAt: string;
    lastLoginAt?: string;
    preferences: {
        notificationsEnabled: boolean;
    };
    childrenIds?: string[];
    parentId?: string;

    // FK dari School
    schoolId?: string;

    // Data gamifikasi anak
    gamification?: {
        totalPoints: number;
        currentStreak: number;
        energy?: number;
        maxEnergy?: number;
        totalBadges: number;
        badges: UserBadge[];
    };
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
        createdAt: "2024-01-10T10:00:00Z",
        preferences: { notificationsEnabled: true },
        childrenIds: ["usr_child_001", "usr_child_002", "usr_child_003"],
        gamification: {
            totalPoints: 0,
            currentStreak: 0,
            energy: 0,
            maxEnergy: 0,
            totalBadges: 0,
            badges: []
        }
    },

    // 3. ANAK PERTAMA (Terhubung ke Budi - Free Plan)
    {
        id: "usr_child_001",
        email: "anak1@dinosaku.com",
        username: "charlotte_s",
        password: "password123",
        fullName: "Charlotte Santoso",
        role: "children",
        status: "active",
        plan: "free",
        avatarUrl: "https://api.dicebear.com/10.x/critters/svg?seed=Charlotte",
        createdAt: "2024-05-10T10:35:00Z",
        preferences: { notificationsEnabled: false },
        parentId: "usr_parent_001",
        classCode: "DINO-4A",
        gamification: {
            totalPoints: 200,
            currentStreak: 1,
            energy: 1,
            maxEnergy: 1,
            totalBadges: 0,
            badges: []
        }
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
        avatarUrl: "https://api.dicebear.com/10.x/critters/svg?seed=Dina",
        createdAt: "2024-05-10T10:40:00Z",
        preferences: { notificationsEnabled: false },
        parentId: "usr_parent_001",
        gamification: {
            totalPoints: 500,
            currentStreak: 3,
            energy: 3,
            maxEnergy: 3,
            totalBadges: 1,
            badges: []
        }
    },

    // 5. ANAK KETIGA (Terhubung ke Budi - Premium Plan)
    {
        id: "usr_child_003",
        email: "anak3@dinosaku.com",
        username: "bagas_s",
        password: "password123",
        fullName: "Bagas Santoso",
        role: "children",
        status: "active",
        plan: "premium",
        avatarUrl: "https://api.dicebear.com/10.x/critters/svg?seed=Bagas",
        createdAt: "2024-05-10T10:45:00Z",
        preferences: { notificationsEnabled: false },
        parentId: "usr_parent_001",
        gamification: {
            totalPoints: 1250,
            currentStreak: 12,
            energy: 3,
            maxEnergy: 3,
            totalBadges: 2,
            badges: [
                { id: "b1", icon: "🌱", title: "Penabung Pemula", description: "Mencatat pengeluaran pertama", unlocked: true },
                { id: "b2", icon: "🔥", title: "Si Paling Tahu", description: "Nilai kuis 100", unlocked: true },
                { id: "b3", icon: "⭐", title: "Bintang Kelas", description: "Lencana Masih Terkunci", unlocked: false },
                { id: "b4", icon: "🏆", title: "Sang Juara", description: "Lencana Masih Terkunci", unlocked: false }
            ]
        }
    },

    // 6. MURID TAMBAHAN UNTUK GURU (Hanya punya Class Code, tidak punya Parent)
    {
        id: "usr_child_004",
        email: "murid1@dinosaku.com",
        username: "tono_s",
        password: "password123",
        fullName: "Tono Saputra",
        role: "children",
        status: "active",
        plan: "free",
        avatarUrl: "https://api.dicebear.com/10.x/critters/svg?seed=Tono",
        createdAt: "2024-06-15T08:00:00Z",
        preferences: { notificationsEnabled: false },
        classCode: "DINO-4A",
        gamification: {
            totalPoints: 350,
            currentStreak: 2,
            energy: 1,
            maxEnergy: 1,
            totalBadges: 1,
            badges: [
                { id: "b1", icon: "🌱", title: "Penabung Pemula", description: "Mencatat pengeluaran pertama", unlocked: true }
            ]
        }
    },

    
    {
        id: "usr_child_005", email: "murid2@dinosaku.com", username: "rara_m", password: "password123", fullName: "Rara Maharani", role: "children", status: "active", plan: "free", avatarUrl: "https://api.dicebear.com/10.x/critters/svg?seed=Rara", createdAt: "2024-06-15T08:00:00Z", preferences: { notificationsEnabled: false }, classCode: "DINO-4A", gamification: { totalPoints: 850, currentStreak: 5, energy: 1, maxEnergy: 1, totalBadges: 2, badges: [] }
    },
    {
        id: "usr_child_006", email: "murid3@dinosaku.com", username: "dewa_k", password: "password123", fullName: "Dewa Kusuma", role: "children", status: "active", plan: "free", avatarUrl: "https://api.dicebear.com/10.x/critters/svg?seed=Dewa", createdAt: "2024-06-15T08:00:00Z", preferences: { notificationsEnabled: false }, classCode: "DINO-4A", gamification: { totalPoints: 1050, currentStreak: 7, energy: 1, maxEnergy: 1, totalBadges: 3, badges: [] }
    },
    {
        id: "usr_child_007", email: "murid4@dinosaku.com", username: "sinta_p", password: "password123", fullName: "Sinta Permata", role: "children", status: "active", plan: "free", avatarUrl: "https://api.dicebear.com/10.x/critters/svg?seed=Sinta", createdAt: "2024-06-15T08:00:00Z", preferences: { notificationsEnabled: false }, classCode: "DINO-4A", gamification: { totalPoints: 420, currentStreak: 1, energy: 1, maxEnergy: 1, totalBadges: 1, badges: [] }
    },
    {
        id: "usr_child_008", email: "murid5@dinosaku.com", username: "bima_w", password: "password123", fullName: "Bima Wijaya", role: "children", status: "active", plan: "free", avatarUrl: "https://api.dicebear.com/10.x/critters/svg?seed=Bima", createdAt: "2024-06-15T08:00:00Z", preferences: { notificationsEnabled: false }, classCode: "DINO-4A", gamification: { totalPoints: 1300, currentStreak: 10, energy: 1, maxEnergy: 1, totalBadges: 4, badges: [] }
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
        avatarUrl: "https://api.dicebear.com/10.x/avataaars/svg?topVariant=hijab&seed=wuwu1oq7",
        createdAt: "2024-08-01T07:15:00Z",
        preferences: { notificationsEnabled: true },
        schoolId: "sch_001",
        classCode: "DINO-4A",
        gamification: {
            totalPoints: 0,
            currentStreak: 0,
            energy: 60,
            maxEnergy: 60,
            totalBadges: 0,
            badges: []
        }
    }
];
