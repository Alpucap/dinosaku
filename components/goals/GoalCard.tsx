'use client';

import { useState } from 'react';
import { Goal } from '@/types/tracker';

interface GoalCardProps {
    goal: Goal;
    isPrimary?: boolean;
    unallocatedBalance: number;
    onSetPrimary?: (goalId: string) => void;
    onAllocate?: (amount: number) => void;
}

export default function GoalCard({
    goal,
    isPrimary,
    unallocatedBalance,
    onSetPrimary,
    onAllocate,
}: GoalCardProps) {
    const [allocateAmount, setAllocateAmount] = useState('');
    const [showAllocateInput, setShowAllocateInput] = useState(false);

    const progressPercent = Math.min(
        Math.round((goal.currentAmount / goal.targetAmount) * 100),
        100
    );

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const handleAllocateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = Number(allocateAmount);
        if (val > 0 && onAllocate) {
            onAllocate(val);
            setAllocateAmount('');
            setShowAllocateInput(false);
        }
    };

    return (
        <div className={`p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${isPrimary
                ? 'bg-surface-green border-brand-primary shadow-sm'
                : 'bg-surface border-border hover:shadow-md'
            }`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-heading font-bold text-lg text-brand-primary">{goal.title}</h4>
                        {isPrimary && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-accent text-brand-primary uppercase tracking-wider shadow-sm flex items-center gap-1">
                                Target Utama
                            </span>
                        )}
                    </div>
                    {goal.deadline && (
                        <p className="text-sm font-medium text-text-muted mt-1 flex items-center gap-1">
                            Beli sebelum: <span className="text-text-primary">{goal.deadline}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!isPrimary && goal.status !== 'completed' && onSetPrimary && (
                        <button
                            onClick={() => onSetPrimary(goal.id)}
                            className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover bg-brand-secondary/30 hover:bg-brand-secondary/50 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                            Jadikan Utama
                        </button>
                    )}
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${progressPercent === 100
                            ? 'bg-success-soft text-success border-success/30'
                            : 'bg-info-soft text-info border-info/30'
                        }`}>
                        {progressPercent === 100 ? 'Hore Selesai!' : `${progressPercent}%`}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 mt-4">
                <div className="w-full bg-surface-soft rounded-full h-4 overflow-hidden border border-border relative">
                    <div
                        className="bg-brand-primary h-full transition-all duration-1000 rounded-full relative"
                        style={{ width: `${progressPercent}%` }}
                    >
                    </div>
                </div>
                <div className="flex justify-between text-sm font-medium text-text-secondary pt-1 px-1">
                    <span>Terkumpul: <span className="text-brand-primary font-bold">{formatRupiah(goal.currentAmount)}</span></span>
                    <span>Target: {formatRupiah(goal.targetAmount)}</span>
                </div>
            </div>

            {/* Action Input: Tambah Alokasi Tabungan */}
            {goal.status !== 'completed' && (
                <div className="pt-4 border-t border-dashed border-border mt-3">
                    {!showAllocateInput ? (
                        <button
                            onClick={() => setShowAllocateInput(true)}
                            disabled={unallocatedBalance <= 0}
                            className="w-full py-2.5 text-sm font-bold text-brand-primary bg-brand-accent hover:bg-brand-accent-hover rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Masukkan Tabungan ke Sini!
                        </button>
                    ) : (
                        <form onSubmit={handleAllocateSubmit} className="flex gap-2 items-center bg-surface-soft p-2 rounded-xl border border-border">
                            <span className="pl-2 font-bold text-text-muted">Rp</span>
                            <input
                                type="number"
                                placeholder={`Maks: ${unallocatedBalance}`}
                                value={allocateAmount}
                                onChange={(e) => setAllocateAmount(e.target.value)}
                                max={unallocatedBalance}
                                className="w-full bg-transparent outline-none font-bold text-brand-primary"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary-hover shadow-sm"
                            >
                                Nabung!
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAllocateInput(false)}
                                className="px-3 py-2 bg-surface text-text-secondary rounded-lg text-sm font-bold hover:bg-surface-soft border border-border"
                            >
                                Batal
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
