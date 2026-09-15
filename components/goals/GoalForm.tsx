'use client';

import { useState } from 'react';

interface GoalFormProps {
    onSubmit: (goal: { title: string; targetAmount: number; deadline?: string }) => void;
    onCancel: () => void;
}

export default function GoalForm({ onSubmit, onCancel }: GoalFormProps) {
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetAmount || Number(targetAmount) <= 0) return;

        onSubmit({
            title,
            targetAmount: Number(targetAmount),
            deadline: deadline || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 bg-emerald-50 rounded-[24px] border-2 border-emerald-100 space-y-4">
            <h4 className="font-extrabold text-emerald-800 text-lg flex items-center gap-2">
                Buat Target Baru!
            </h4>

            <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 block">Mau Beli Apa?</label>
                <input
                    type="text"
                    placeholder="Misal: Sepatu Roda, Mainan Baru"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-emerald-100 rounded-2xl focus:border-[var(--color-brand-accent)] focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-sm"
                    required
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 block">Harganya Berapa? (Rp)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                    <input
                        type="number"
                        placeholder="0"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border-2 border-emerald-100 rounded-2xl focus:border-[var(--color-brand-accent)] focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-sm"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 block">Kapan Mau Dibeli? (Boleh Kosong)</label>
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-emerald-100 rounded-2xl focus:border-[var(--color-brand-accent)] focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-sm text-gray-600"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 text-sm font-bold text-gray-500 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                    Nanti Dulu
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 text-sm font-extrabold text-white bg-[var(--color-brand-primary)] rounded-xl shadow-[0_4px_0_0_#043D22] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#043D22] active:translate-y-[4px] active:shadow-none transition-all"
                >
                    Simpan Target!
                </button>
            </div>
        </form>
    );
}