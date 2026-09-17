'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function getTrackerData() {
    const user = await getSessionUser();
    if (!user) throw new Error('Not authenticated');

    const transactions = await prisma.walletTransaction.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' }
    });

    const goals = await prisma.savingGoal.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });

    return {
        transactions: transactions.map(t => ({
            id: t.id,
            type: t.type === 'INCOME' ? 'income' : 'expense',
            amount: t.amount,
            category: t.category,
            description: t.description || '',
            date: t.date.toISOString().split('T')[0]
        })),
        goals: goals.map(g => ({
            id: g.id,
            title: g.title,
            targetAmount: g.targetAmount,
            currentAmount: g.currentAmount,
            status: g.isCompleted ? 'completed' : 'in_progress',
        }))
    };
}

export async function addTransactionAction(data: { type: 'income' | 'expense', amount: number, category: string, description: string, date: string }) {
    const user = await getSessionUser();
    if (!user) throw new Error('Not authenticated');

    await prisma.walletTransaction.create({
        data: {
            userId: user.id,
            type: data.type === 'income' ? 'INCOME' : 'EXPENSE',
            amount: data.amount,
            category: data.category,
            description: data.description,
            date: new Date(data.date)
        }
    });

    revalidatePath('/learn/tracker');
    revalidatePath('/learn/impian');
}

export async function addGoalAction(data: { title: string, targetAmount: number }) {
    const user = await getSessionUser();
    if (!user) throw new Error('Not authenticated');

    await prisma.savingGoal.create({
        data: {
            userId: user.id,
            title: data.title,
            targetAmount: data.targetAmount,
            currentAmount: 0,
            isCompleted: false
        }
    });

    revalidatePath('/learn/impian');
    revalidatePath('/learn/tracker');
}

export async function allocateToGoalAction(goalId: string, amount: number) {
    const user = await getSessionUser();
    if (!user) throw new Error('Not authenticated');

    const goal = await prisma.savingGoal.findUnique({ where: { id: goalId } });
    if (!goal || goal.userId !== user.id) throw new Error('Goal not found');

    const newAmount = goal.currentAmount + amount;
    
    await prisma.savingGoal.update({
        where: { id: goalId },
        data: {
            currentAmount: newAmount,
            isCompleted: newAmount >= goal.targetAmount
        }
    });

    revalidatePath('/learn/impian');
    revalidatePath('/learn/tracker');
}

export async function resetWalletAction() {
    const user = await getSessionUser();
    if (!user) throw new Error('Not authenticated');

    await prisma.walletTransaction.deleteMany({
        where: { userId: user.id }
    });

    await prisma.savingGoal.deleteMany({
        where: { userId: user.id }
    });

    revalidatePath('/learn/tracker');
    revalidatePath('/learn/impian');
}
