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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary block">Mau Beli Apa?</label>
                <input
                    type="text"
                    placeholder="Misal: Sepatu Roda, Mainan Robot, Buku Cerita"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border-2 border-border rounded-xl focus:border-brand-primary outline-none transition-all font-medium text-sm text-text-primary"
                    required
                    autoFocus
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary block">Harganya Berapa? (Rp)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-muted text-sm">Rp</span>
                    <input
                        type="number"
                        placeholder="0"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-surface border-2 border-border rounded-xl focus:border-brand-primary outline-none transition-all font-bold text-sm text-text-primary"
                        required
                        min="1000"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary block">Kapan Mau Dibeli? (Opsional)</label>
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border-2 border-border rounded-xl focus:border-brand-primary outline-none transition-all font-medium text-sm text-text-primary"
                />
            </div>

            <div className="flex gap-3 pt-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2.5 text-sm font-bold text-text-secondary bg-surface border border-border rounded-xl hover:bg-surface-soft transition-colors cursor-pointer"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2.5 text-sm font-bold text-white bg-brand-primary rounded-xl hover:bg-brand-primary-hover shadow-sm transition-all cursor-pointer"
                >
                    Simpan Impian!
                </button>
            </div>
        </form>
    );
}
