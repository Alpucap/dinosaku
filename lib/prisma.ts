import { PrismaClient } from '@prisma/client'

// Mencegah Prisma membuat koneksi berulang kali saat proses Hot-Reload di Next.js (Dev Mode)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
