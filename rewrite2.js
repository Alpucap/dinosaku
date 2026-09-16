const fs = require('fs');

const code = `
'use client';

import { useState } from 'react';
import TransactionForm from '@/components/tracker/TransactionForm';
import GoalCard from '@/components/goals/GoalCard';
import GoalForm from '@/components/goals/GoalForm';
import { Transaction, Goal } from '@/types/tracker';
import Image from 'next/image';
import { addTransactionAction, addGoalAction, allocateToGoalAction, resetWalletAction } from './actions';
import { ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';

interface TrackerClientProps {
    initialTransactions: Transaction[];
    initialGoals: Goal[];
}

export default function TrackerClient({ initialTransactions, initialGoals }: TrackerClientProps) {
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [primaryGoalId, setPrimaryGoalId] = useState<string | null>(
        initialGoals.length > 0 ? initialGoals[0].id : null
    );
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const transactions = initialTransactions;
    const goals = initialGoals;

    // Hitung total finansial
    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalAllocatedToGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);

    // Saldo bebas yang siap dialokasikan ke Goals
    const unallocatedBalance = totalIncome - totalExpense - totalAllocatedToGoals;

    // Handle Tambah Transaksi
    const handleAddTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
        await addTransactionAction(newTxData);
        setCurrentPage(1); // Reset to first page to see new transaction
    };

    // Handle Tambah Goal Baru
    const handleAddGoal = async (goalData: { title: string; targetAmount: number; deadline?: string }) => {
        await addGoalAction({ title: goalData.title, targetAmount: goalData.targetAmount });
        setShowGoalForm(false);
    };

    // Handle Nabung (Alokasi dari Saldo Bebas ke Goal)
    const handleAllocate = async (goalId: string, amount: number) => {
        if (amount > unallocatedBalance || amount <= 0) return;
        await allocateToGoalAction(goalId, amount);
    };

    // Handle Reset
    const handleReset = async () => {
        if (confirm("Apakah kamu yakin ingin mereset seluruh dompet (menghapus semua riwayat dan impian)?")) {
            await resetWalletAction();
            setCurrentPage(1);
        }
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));
    const paginatedTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="learning-page">
            <header className="page-heading">
                <p className="eyebrow">Manajemen Keuangan</p>
                <h1>Dompet & Impianku</h1>
                <p>Catat uang jajanmu dan tabung untuk membeli impianmu!</p>
            </header>

            <div className="space-y-6">
                {/* Ringkasan Keuangan */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <p className="text-sm font-bold text-text-muted flex items-center gap-2">
                            <Image src="/mascot/dino.png" alt="Dino" width={20} height={20} className="object-contain" /> Uang Masuk
                        </p>
                        <p className="text-2xl font-black text-brand-primary mt-2">{formatRupiah(totalIncome)}</p>
                    </div>
                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <p className="text-sm font-bold text-text-muted flex items-center gap-2">
                            <Image src="/mascot/dino.png" alt="Dino" width={20} height={20} className="object-contain grayscale opacity-60" /> Uang Keluar
                        </p>
                        <p className="text-2xl font-black text-destructive mt-2">{formatRupiah(totalExpense)}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1 bg-brand-primary/10 p-6 rounded-2xl border border-brand-primary/20 shadow-sm flex flex-col justify-center items-center text-center">
                        <p className="text-sm font-bold text-brand-primary">Total Tabungan Impian</p>
                        <p className="text-2xl font-black text-brand-primary mt-1">{formatRupiah(totalAllocatedToGoals)}</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Top Left: Form Transaksi */}
                    <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-border">
                        <TransactionForm onSubmit={handleAddTransaction} />
                    </div>

                    {/* Top Right: Riwayat Transaksi */}
                    <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-border space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-heading font-bold text-xl text-brand-primary">Catatan Uang</h3>
                            <button 
                                onClick={handleReset}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-danger-soft hover:bg-danger/20 text-danger rounded-xl font-bold text-xs transition-colors border border-danger/20"
                            >
                                <RefreshCcw size={14} /> Reset Dompet
                            </button>
                        </div>
                        {transactions.length === 0 ? (
                            <div className="text-center py-6 bg-surface-soft rounded-2xl border border-border">
                                <p className="text-text-muted font-bold text-sm">Masih kosong... Yuk, mulai catat uangmu!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="divide-y divide-border">
                                    {paginatedTransactions.map((t) => {
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
                                            <div key={t.id} className="py-3 flex justify-between items-center group hover:bg-surface-soft px-2 rounded-xl transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={\`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-black text-xl \${t.type === 'income' ? 'bg-brand-secondary/30 text-brand-primary' : 'bg-destructive/10 text-destructive'}\`}>
                                                        {t.type === 'income' ? '+' : '-'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-text-primary">{t.description || displayCategory}</p>
                                                        <p className="text-xs font-semibold text-text-muted">{t.date}</p>
                                                    </div>
                                                </div>
                                                <span className={\`shrink-0 font-bold text-sm px-3 py-1 rounded-lg \${t.type === 'income' ? 'text-brand-primary bg-brand-secondary/20' : 'text-destructive bg-destructive/10'}\`}>
                                                    {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between pt-2 border-t border-border">
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg hover:bg-surface-soft disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className="text-xs font-bold text-text-muted">
                                            Halaman {currentPage} dari {totalPages}
                                        </span>
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg hover:bg-surface-soft disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row: Financial Goals */}
                <div className="space-y-6">
                    {/* Celengan Siap Nabung */}
                    <div className="bg-brand-primary p-6 sm:p-8 rounded-3xl text-white shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="absolute -right-4 -bottom-8 opacity-20 transform -rotate-12 pointer-events-none">
                            <Image src="/mascot/dino.png" alt="Dino" width={200} height={200} className="object-contain" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-brand-secondary flex items-center gap-2">Uang yang Bisa Ditabung (Saldo Bebas)</p>
                            <p className="text-3xl font-black text-white mt-2">{formatRupiah(unallocatedBalance)}</p>
                            <p className="text-xs text-brand-secondary/80 mt-2 font-medium">Uang ini sisa dari pemasukan dikurangi pengeluaran, bisa dimasukkan ke Target Impianmu!</p>
                        </div>
                    </div>

                    <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-border space-y-5 relative overflow-hidden">
                        {/* Decorative element */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-secondary rounded-full blur-3xl opacity-20"></div>
                        
                        <div className="flex justify-between items-center relative z-10">
                            <h2 className="text-2xl font-heading font-bold text-brand-primary flex items-center gap-3">
                                <Image src="/mascot/dino.png" alt="Dino" width={32} height={32} className="object-contain drop-shadow-sm" />
                                Target Impianku
                            </h2>
                            {!showGoalForm && (
                                <button
                                    onClick={() => setShowGoalForm(true)}
                                    className="bg-info-soft hover:bg-info/20 text-info font-bold text-sm py-2 px-4 rounded-xl border border-info/30 transition-all shadow-sm hover:-translate-y-1 flex items-center gap-2"
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
                                <Image src="/mascot/dino.png" alt="Dino Sad" width={64} height={64} className="mb-3 opacity-60 grayscale" />
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
        </div>
    );
}
\`;

fs.writeFileSync('app/learn/tracker/TrackerClient.tsx', code);
`;
node rewrite2.js
