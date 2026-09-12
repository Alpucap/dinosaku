import React from 'react';
import Link from 'next/link';
import { TermsContent } from '@/components/shared/terms-content';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-app font-sans text-primary p-8 md:p-16">
            <div className="max-w-3xl mx-auto bg-surface rounded-2xl shadow-soft p-8 md:p-12 border-t-[8px] border-brand-primary">
                <Link href="/register" className="inline-flex items-center text-sm font-semibold text-brand-primary hover:underline mb-8">
                    &larr; Kembali
                </Link>

                <h1 className="text-4xl font-heading text-primary mb-6">Syarat & Ketentuan Dinosaku</h1>

                <div className="mt-8">
                    <TermsContent />
                </div>

                <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    Terakhir diperbarui: 11 September 2026
                </div>
            </div>
        </div>
    );
}
