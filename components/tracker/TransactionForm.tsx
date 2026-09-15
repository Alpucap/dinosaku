'use client';

import { useState } from 'react';
import { TransactionType, Category } from '@/types/tracker';

interface TransactionFormProps {
    onSubmit: (data: { type: TransactionType; amount: number; category: Category; description: string; date: string }) => void;
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<Category>('food');
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) return;

        onSubmit({
            type,
            amount: Number(amount),
            category,
            description,
            date,
        });

        setAmount('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <h3 className="text-xl font-heading font-bold text-brand-primary flex items-center gap-3">
                Catat Uangmu
            </h3>

            {/* Selector Tipe Transaksi */}
            <div className="flex gap-2 bg-surface-soft p-1.5 rounded-xl border border-border">
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${type === 'expense'
                            ? 'bg-destructive text-white shadow-sm scale-[1.02]'
                            : 'bg-transparent text-text-secondary hover:bg-destructive/10 hover:text-destructive'
                        }`}
                >
                    Uang Keluar
                </button>
                <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${type === 'income'
                            ? 'bg-brand-primary text-white shadow-sm scale-[1.02]'
                            : 'bg-transparent text-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary'
                        }`}
                >
                    Uang Masuk
                </button>
            </div>

            {/* Input Nominal */}
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary block">Jumlah Uang (Rp)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-text-muted">Rp</span>
                    <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-surface border-2 border-border rounded-xl focus:bg-surface focus:border-brand-primary outline-none transition-all font-semibold text-lg"
                        required
                    />
                </div>
            </div>

            {/* Input Kategori */}
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary block">Kategori</label>
                <div className="relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:bg-surface focus:border-brand-primary outline-none transition-all font-medium appearance-none text-text-primary"
                    >
                        {type === 'expense' ? (
                            <>
                                <option value="food">Makanan & Minuman</option>
                                <option value="transport">Jalan-jalan (Transport)</option>
                                <option value="shopping">Jajan / Belanja</option>
                                <option value="entertainment">Main / Hiburan</option>
                                <option value="bills">Bayar Tagihan</option>
                                <option value="other">Lain-lain</option>
                            </>
                        ) : (
                            <>
                                <option value="salary">Uang Jajan / Hadiah</option>
                                <option value="freelance">Hasil Kerja / Jualan</option>
                                <option value="other">Lain-lain</option>
                            </>
                        )}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                        ▼
                    </div>
                </div>
            </div>

            {/* Keterangan */}
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary block">Catatan Pendek (Opsional)</label>
                <input
                    type="text"
                    placeholder="Beli es krim..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:bg-surface focus:border-brand-primary outline-none transition-all font-medium"
                />
            </div>

            {/* Tanggal */}
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary block">Tanggal</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:bg-surface focus:border-brand-primary outline-none transition-all font-medium text-text-primary"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
                Simpan Catatan
            </button>
        </form>
    );
}
