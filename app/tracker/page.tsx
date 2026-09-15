'use client';

import { useState } from 'react';
import TransactionForm from '@/components/tracker/TransactionForm';
import GoalCard from '@/components/goals/GoalCard';
import GoalForm from '@/components/goals/GoalForm';
import { Transaction, Goal } from '@/types/tracker';
import Image from 'next/image';

export default function TrackerPage() {
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [primaryGoalId, setPrimaryGoalId] = useState<string | null>(null);

    // Hitung total finansial
    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalAllocatedToGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);

    // Saldo bebas yang siap dialokasikan ke Goals
    const unallocatedBalance = Math.max(0, totalIncome - totalExpense - totalAllocatedToGoals);

    // Handle Tambah Transaksi (Hanya update dompet utama)
    const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
        const newTx: Transaction = {
            ...newTxData,
            id: Date.now().toString(),
        };
        setTransactions([newTx, ...transactions]);
    };

    // Handle Tambah Goal Baru
    const handleAddGoal = (goalData: { title: string; targetAmount: number; deadline?: string }) => {
        const newId = Date.now().toString();
        const newGoal: Goal = {
            id: newId,
            title: goalData.title,
            targetAmount: goalData.targetAmount,
            currentAmount: 0,
            deadline: goalData.deadline,
            status: 'in_progress',
        };

        setGoals([...goals, newGoal]);
        if (!primaryGoalId) {
            setPrimaryGoalId(newId);
        }
        setShowGoalForm(false);
    };

    // Handle Manual Alokasi Dana dari Saldo Bebas ke Goal tertentu
    const handleAllocate = (goalId: string, amount: number) => {
        if (amount <= 0 || amount > unallocatedBalance) return;

        setGoals((prevGoals) =>
            prevGoals.map((g) => {
                if (g.id !== goalId) return g;
                const updatedCurrent = Math.min(g.targetAmount, g.currentAmount + amount);
                return {
                    ...g,
                    currentAmount: updatedCurrent,
                    status: updatedCurrent >= g.targetAmount ? 'completed' : 'in_progress',
                };
            })
        );
    };

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="min-h-screen bg-[#F8FAF5] pb-12">
            <header className="bg-white/80 backdrop-blur-md border-b-4 border-emerald-100 sticky top-0 z-10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-3xl shadow-sm">
                <div className="flex items-center gap-3">
                    <Image src="/mascot/dino.png" alt="Dino" width={44} height={44} className="object-contain drop-shadow-md animate-bounce" style={{ animationDuration: '3s' }} />
                    <div>
                        <h1 className="font-extrabold text-2xl text-[var(--color-brand-primary)] leading-none">Dinosaku</h1>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#86B92F]">Petualangan Uangku 🦖</span>
                    </div>
                </div>
                <a href="/" className="px-4 py-2 bg-emerald-50 rounded-xl text-sm font-bold text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 transition-colors border-2 border-emerald-100">
                    Kembali ke Beranda
                </a>
            </header>

            <main className="max-w-6xl mx-auto px-4 mt-8 space-y-6">
                {/* Summary Card Dompet & Saldo Bebas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-6 rounded-[24px] border-2 border-emerald-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <p className="text-sm font-extrabold text-gray-500 flex items-center gap-2">
                            <Image src="/mascot/dino.png" alt="Dino" width={20} height={20} className="object-contain" /> Uang Masuk
                        </p>
                        <p className="text-2xl font-black text-emerald-600 mt-2">{formatRupiah(totalIncome)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border-2 border-emerald-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <p className="text-sm font-extrabold text-gray-500 flex items-center gap-2">
                            <Image src="/mascot/dino.png" alt="Dino" width={20} height={20} className="object-contain grayscale opacity-60" /> Uang Keluar
                        </p>
                        <p className="text-2xl font-black text-red-500 mt-2">{formatRupiah(totalExpense)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Kiri: Form Transaksi & Riwayat */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border-2 border-emerald-50">
                            <TransactionForm onSubmit={handleAddTransaction} />
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border-2 border-emerald-50 space-y-4">
                            <h3 className="font-extrabold text-xl text-[var(--color-brand-primary)]">Catatan Uang Hari Ini</h3>
                            {transactions.length === 0 ? (
                                <div className="text-center py-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                                    <p className="text-gray-400 font-bold text-sm">Masih kosong... Yuk, mulai catat uangmu!</p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-gray-100 max-h-[350px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#A7F3D0 transparent' }}>
                                    {transactions.map((t) => {
                                        const categoryLabels: Record<string, string> = {
                                            food: 'Makanan & Minuman',
                                            transport: 'Jalan-jalan',
                                            shopping: 'Jajan / Belanja',
                                            entertainment: 'Main / Hiburan',
                                            bills: 'Bayar Tagihan',
                                            salary: 'Uang Jajan / Hadiah',
                                            freelance: 'Hasil Kerja / Jualan',
                                            other: 'Lain-lain',
                                        };
                                        const displayCategory = categoryLabels[t.category] || t.category;
                                        
                                        return (
                                            <div key={t.id} className="py-3 flex justify-between items-center group hover:bg-emerald-50/30 px-2 rounded-xl transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xl ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
                                                        {t.type === 'income' ? '+' : '-'}
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-sm text-gray-700">{t.description || displayCategory}</p>
                                                        <p className="text-xs font-semibold text-gray-400">{t.date}</p>
                                                    </div>
                                                </div>
                                                <span className={`font-black text-base px-3 py-1 rounded-lg ${t.type === 'income' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                                    {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kanan: Financial Goals & Alokasi */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Celengan Siap Nabung */}
                        <div className="bg-gradient-to-br from-[var(--color-brand-primary)] to-emerald-800 p-6 sm:p-8 rounded-[32px] text-white shadow-[0_6px_0_0_#032F1A] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#032F1A] transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="absolute -right-4 -bottom-8 opacity-20 transform -rotate-12 pointer-events-none">
                                <Image src="/mascot/dino.png" alt="Dino" width={200} height={200} className="object-contain" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-sm font-extrabold text-emerald-200 flex items-center gap-2">Uang yang Bisa Ditabung (Saldo Bebas)</p>
                                <p className="text-3xl font-black text-white mt-2">{formatRupiah(unallocatedBalance)}</p>
                                <p className="text-xs text-emerald-300 mt-2 font-medium">Uang ini sisa dari pemasukan dikurangi pengeluaran, bisa dimasukkan ke Target Impianmu!</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border-2 border-emerald-50 space-y-5 relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-60"></div>
                            
                            <div className="flex justify-between items-center relative z-10">
                                <h2 className="text-2xl font-extrabold text-[var(--color-brand-primary)] flex items-center gap-3">
                                    <Image src="/mascot/dino.png" alt="Dino" width={32} height={32} className="object-contain drop-shadow-sm" />
                                    Target Impianku
                                </h2>
                                {!showGoalForm && (
                                    <button
                                        onClick={() => setShowGoalForm(true)}
                                        className="bg-sky-100 hover:bg-sky-200 text-sky-700 font-extrabold text-sm py-2 px-4 rounded-xl border-2 border-sky-200 transition-all shadow-sm hover:-translate-y-1 flex items-center gap-2"
                                    >
                                        Tambah Impian!
                                    </button>
                                )}
                            </div>

                            {showGoalForm && (
                                <GoalForm onSubmit={handleAddGoal} onCancel={() => setShowGoalForm(false)} />
                            )}

                            {goals.length === 0 ? (
                                <div className="text-center py-10 border-4 border-dashed border-emerald-100 rounded-[24px] bg-emerald-50/50 flex flex-col items-center">
                                    <Image src="/mascot/dino.png" alt="Dino Sad" width={64} height={64} className="mb-3 opacity-60 grayscale" />
                                    <p className="text-base text-emerald-800 font-bold">Belum ada target impian nih...</p>
                                    <p className="text-sm text-emerald-600/70 mt-1 font-semibold">Klik "Tambah Impian!" buat mulai menabung untuk barang kesukaanmu!</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
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
            </main>
        </div>
    );
}