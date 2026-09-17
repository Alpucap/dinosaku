'use client';

import { useState } from 'react';
import Link from 'next/link';
import GoalCard from '@/components/goals/GoalCard';
import GoalForm from '@/components/goals/GoalForm';
import { Transaction, Goal } from '@/types/tracker';
import { addGoalAction, allocateToGoalAction } from '../tracker/actions';
import { PiggyBank, Target, Wallet } from 'lucide-react';

interface ImpianClientProps {
    initialTransactions: Transaction[];
    initialGoals: Goal[];
}

export default function ImpianClient({ initialTransactions, initialGoals }: ImpianClientProps) {
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [primaryGoalId, setPrimaryGoalId] = useState<string | null>(
        initialGoals.length > 0 ? initialGoals[0].id : null
    );

    const transactions = initialTransactions;
    const goals = initialGoals;

    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalAllocatedToGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);

    const unallocatedBalance = totalIncome - totalExpense - totalAllocatedToGoals;

    const handleAddGoal = async (goalData: { title: string; targetAmount: number; deadline?: string }) => {
        await addGoalAction({ title: goalData.title, targetAmount: goalData.targetAmount });
        setShowGoalForm(false);
    };

    const handleAllocate = async (goalId: string, amount: number) => {
        if (amount > unallocatedBalance || amount <= 0) return;
        await allocateToGoalAction(goalId, amount);
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="learning-page">
            <header className="page-heading">
                <p className="eyebrow">Target Tabungan</p>
                <h1>Impianku</h1>
                <p>Tabung uangmu sedikit demi sedikit untuk membeli barang impianmu!</p>
            </header>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-brand-primary p-6 rounded-2xl text-white shadow-md flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Uang yang Bisa Ditabung</p>
                            <p className={`text-3xl font-black mt-2 ${unallocatedBalance < 0 ? 'text-red-300' : 'text-white'}`}>{formatRupiah(unallocatedBalance)}</p>
                            <p className="text-xs text-brand-secondary/80 mt-2 font-medium">
                                {unallocatedBalance < 0
                                    ? 'Uang keluarmu lebih banyak dari uang masuk. Catat pemasukan dulu sebelum menabung, ya!'
                                    : 'Sisa uang di dompetmu yang belum dimasukkan ke impian.'}
                            </p>
                        </div>
                        <span className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-secondary">
                            <PiggyBank size={32} />
                        </span>
                    </div>

                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-text-muted">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent">
                                <Target size={16} />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider">Total Tabungan Impian</span>
                        </div>
                        <p className="text-2xl font-black text-brand-primary mt-3">{formatRupiah(totalAllocatedToGoals)}</p>
                        <Link
                            href="/learn/tracker"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline w-fit"
                        >
                            <Wallet size={14} /> Catat uang di Dompetku
                        </Link>
                    </div>
                </div>

                <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-border space-y-5">
                    <div className="flex justify-between items-center gap-3">
                        <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-primary flex items-center gap-2 sm:gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-accent/15 text-brand-accent">
                                <Target size={20} />
                            </span>
                            Target Impianku
                        </h2>
                        {!showGoalForm && (
                            <button
                                onClick={() => setShowGoalForm(true)}
                                className="bg-info-soft hover:bg-info/20 text-info font-bold text-sm py-2 px-4 rounded-xl border border-info/30 transition-all shadow-sm hover:-translate-y-1 flex items-center gap-2 shrink-0"
                            >
                                Tambah Impian!
                            </button>
                        )}
                    </div>

                    {showGoalForm && (
                        <GoalForm onSubmit={handleAddGoal} onCancel={() => setShowGoalForm(false)} />
                    )}

                    {goals.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl bg-surface-soft flex flex-col items-center">
                            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                                <Target size={28} />
                            </span>
                            <p className="text-base text-text-primary font-bold">Belum ada target impian nih...</p>
                            <p className="text-sm text-text-muted mt-1 font-medium">Klik "Tambah Impian!" buat mulai menabung untuk barang kesukaanmu!</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {goals.map((goal) => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    isPrimary={goal.id === primaryGoalId}
                                    unallocatedBalance={unallocatedBalance}
                                    onSetPrimary={(id) => setPrimaryGoalId(id)}
                                    onAllocate={(amount) => handleAllocate(goal.id, amount)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
