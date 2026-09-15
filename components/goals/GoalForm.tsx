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
        <form onSubmit={handleSubmit} className="p-5 bg-surface-soft rounded-2xl border border-border space-y-4">
            <h4 className="font-heading font-bold text-brand-primary text-lg flex items-center gap-2">
                Buat Target Baru!
            </h4>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary block">Mau Beli Apa?</label>
                <input
                    type="text"
                    placeholder="Misal: Sepatu Roda, Mainan Baru"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:border-brand-primary outline-none transition-all font-medium text-sm text-text-primary"
                    required
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary block">Harganya Berapa? (Rp)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-muted">Rp</span>
                    <input
                        type="number"
                        placeholder="0"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-surface border-2 border-border rounded-xl focus:border-brand-primary outline-none transition-all font-bold text-sm text-text-primary"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary block">Kapan Mau Dibeli? (Boleh Kosong)</label>
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:border-brand-primary outline-none transition-all font-medium text-sm text-text-primary"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 text-sm font-bold text-text-secondary bg-surface border border-border rounded-xl hover:bg-surface-soft transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 text-sm font-bold text-white bg-brand-primary rounded-xl hover:bg-brand-primary-hover shadow-sm transition-all"
                >
                    Simpan Target!
                </button>
            </div>
        </form>
    );
}
