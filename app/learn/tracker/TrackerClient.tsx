
'use client';

import { useState } from 'react';
import Link from 'next/link';
import TransactionForm from '@/components/tracker/TransactionForm';
import { Transaction } from '@/types/tracker';
import { addTransactionAction, resetWalletAction } from './actions';
import { ChevronLeft, ChevronRight, RefreshCcw, TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

interface TrackerClientProps {
    initialTransactions: Transaction[];
}

export default function TrackerClient({ initialTransactions }: TrackerClientProps) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const transactions = initialTransactions;

    // Hitung total finansial
    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const walletBalance = totalIncome - totalExpense;

    // Handle Tambah Transaksi
    const handleAddTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
        await addTransactionAction(newTxData);
        setCurrentPage(1); // Reset to first page to see new transaction
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
                <h1>Dompetku</h1>
                <p>Catat uang jajan yang masuk dan keluar setiap hari.</p>
            </header>

            <div className="space-y-6">
                {/* Ringkasan Keuangan */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center gap-2 text-text-muted">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                                <TrendingUp size={16} />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider">Uang Masuk</span>
                        </div>
                        <p className="text-2xl font-black text-brand-primary mt-3">{formatRupiah(totalIncome)}</p>
                    </div>
                    <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center gap-2 text-text-muted">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                <TrendingDown size={16} />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider">Uang Keluar</span>
                        </div>
                        <p className="text-2xl font-black text-destructive mt-3">{formatRupiah(totalExpense)}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1 bg-brand-primary/10 p-5 rounded-2xl border border-brand-primary/20 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-brand-primary">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/60 text-brand-primary">
                                <Wallet size={16} />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider">Sisa Uangku</span>
                        </div>
                        <p className={`text-2xl font-black mt-3 ${walletBalance < 0 ? 'text-destructive' : 'text-brand-primary'}`}>{formatRupiah(walletBalance)}</p>
                        <Link
                            href="/learn/impian"
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline w-fit"
                        >
                            <Target size={14} /> Tabung ke Impianku
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    
                    {/* Top Left: Form Transaksi */}
                    <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-border">
                        <TransactionForm onSubmit={handleAddTransaction} />
                    </div>

                    {/* Top Right: Riwayat Transaksi */}
                    <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-border flex flex-col h-full space-y-4">
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
                            <div className="space-y-4 flex flex-col flex-1">
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
                                                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-black text-xl ${t.type === 'income' ? 'bg-brand-secondary/30 text-brand-primary' : 'bg-destructive/10 text-destructive'}`}>
                                                        {t.type === 'income' ? '+' : '-'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-text-primary">{t.description || displayCategory}</p>
                                                        <p className="text-xs font-semibold text-text-muted">{t.date}</p>
                                                    </div>
                                                </div>
                                                <span className={`shrink-0 font-bold text-sm px-3 py-1 rounded-lg ${t.type === 'income' ? 'text-brand-primary bg-brand-secondary/20' : 'text-destructive bg-destructive/10'}`}>
                                                    {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
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

            </div>
        </div>
    );
}
