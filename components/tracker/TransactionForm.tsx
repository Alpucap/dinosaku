'use client';

import { useState } from 'react';
import { TransactionType, Category } from '@/types/tracker';
import Image from 'next/image';

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
            <h3 className="text-xl font-extrabold text-[var(--color-brand-primary)] flex items-center gap-3">
                Catat Uangmu
            </h3>

            {/* Selector Tipe Transaksi */}
            <div className="flex gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${type === 'expense'
                            ? 'bg-rose-500 text-white shadow-md transform scale-[1.02]'
                            : 'bg-transparent text-gray-500 hover:bg-rose-100 hover:text-rose-600'
                        }`}
                >
                    Uang Keluar
                </button>
                <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${type === 'income'
                            ? 'bg-[var(--color-brand-primary)] text-white shadow-md transform scale-[1.02]'
                            : 'bg-transparent text-gray-500 hover:bg-emerald-100 hover:text-emerald-700'
                        }`}
                >
                    Uang Masuk
                </button>
            </div>

            {/* Input Nominal */}
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">Jumlah Uang (Rp)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                    <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[var(--color-brand-accent)] focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-lg"
                        required
                    />
                </div>
            </div>

            {/* Input Kategori */}
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">Untuk Apa?</label>
                <div className="relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[var(--color-brand-accent)] focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-semibold appearance-none"
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
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        ▼
                    </div>
                </div>
            </div>

            {/* Input Deskripsi */}
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">Catatan Kecil</label>
                <input
                    type="text"
                    placeholder="Misal: Beli es krim, Hadiah dari Nenek"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[var(--color-brand-accent)] focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-sm"
                />
            </div>

            {/* Input Tanggal */}
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">Tanggal Berapa?</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[var(--color-brand-accent)] focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-sm"
                />
            </div>

            <button type="submit" className="w-full py-4 mt-2 bg-[var(--color-brand-accent)] hover:bg-[#86B92F] text-[var(--color-brand-primary)] font-extrabold text-lg rounded-2xl shadow-[0_4px_0_0_#75A625] hover:shadow-[0_2px_0_0_#75A625] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px]">
                {type === 'expense' ? 'Keluarkan Uang' : 'Simpan Uang'}
            </button>
        </form>
    );
}