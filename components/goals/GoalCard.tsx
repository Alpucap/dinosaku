'use client';

import { useState } from 'react';
import { Goal } from '@/types/tracker';
import Image from 'next/image';

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
        <div className={`p-5 rounded-[24px] border-2 transition-all duration-300 transform hover:-translate-y-1 ${isPrimary
                ? 'bg-emerald-50/90 border-emerald-400 shadow-[0_6px_0_0_#34D399]'
                : 'bg-white border-emerald-100 hover:shadow-lg'
            }`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        {isPrimary && (
                            <Image src="/mascot/dino.png" alt="Dino" width={24} height={24} className="object-contain drop-shadow-sm" />
                        )}
                        <h4 className="font-extrabold text-lg text-[var(--color-brand-primary)]">{goal.title}</h4>
                        {isPrimary && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#98CE36] text-[#064E2B] uppercase tracking-wider shadow-sm flex items-center gap-1">
                                Target Utama
                            </span>
                        )}
                    </div>
                    {goal.deadline && (
                        <p className="text-sm font-semibold text-gray-400 mt-1 flex items-center gap-1">
                            Beli sebelum: <span className="text-gray-600">{goal.deadline}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!isPrimary && goal.status !== 'completed' && onSetPrimary && (
                        <button
                            onClick={() => onSetPrimary(goal.id)}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
                        >
                            Jadikan Utama
                        </button>
                    )}
                    <span className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 ${progressPercent === 100
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                            : 'bg-sky-100 text-sky-700 border-sky-300'
                        }`}>
                        {progressPercent === 100 ? 'Hore Selesai!' : `${progressPercent}%`}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 mt-4">
                <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden border-2 border-gray-200 relative">
                    <div
                        className="bg-gradient-to-r from-[var(--color-brand-accent)] to-[#86B92F] h-full transition-all duration-1000 rounded-full relative"
                        style={{ width: `${progressPercent}%` }}
                    >
                        {/* Removed running emoji to clean up UI */}
                    </div>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500 pt-1 px-1">
                    <span>Terkumpul: <span className="text-emerald-600">{formatRupiah(goal.currentAmount)}</span></span>
                    <span>Target: {formatRupiah(goal.targetAmount)}</span>
                </div>
            </div>

            {/* Action Input: Tambah Alokasi Tabungan */}
            {goal.status !== 'completed' && (
                <div className="pt-4 border-t-2 border-dashed border-emerald-100 mt-3">
                    {!showAllocateInput ? (
                        <button
                            onClick={() => setShowAllocateInput(true)}
                            disabled={unallocatedBalance <= 0}
                            className="w-full py-2.5 text-sm font-extrabold text-[#064E2B] bg-[#98CE36] hover:bg-[#86B92F] rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_0_0_#75A625] active:translate-y-[2px] active:shadow-[0_2px_0_0_#75A625] flex items-center justify-center gap-2"
                        >
                            Masukkan Tabungan ke Sini!
                        </button>
                    ) : (
                        <form onSubmit={handleAllocateSubmit} className="flex gap-2 items-center bg-gray-50 p-2 rounded-2xl border-2 border-gray-100">
                            <span className="pl-2 font-bold text-gray-400">Rp</span>
                            <input
                                type="number"
                                placeholder={`Maks: ${unallocatedBalance}`}
                                value={allocateAmount}
                                onChange={(e) => setAllocateAmount(e.target.value)}
                                max={unallocatedBalance}
                                className="w-full bg-transparent outline-none font-bold text-emerald-700"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[var(--color-brand-primary)] text-white rounded-xl text-sm font-extrabold hover:bg-emerald-900 shadow-sm"
                            >
                                Nabung!
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAllocateInput(false)}
                                className="px-3 py-2 bg-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-300"
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