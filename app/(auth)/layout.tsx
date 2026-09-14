import { ReactNode } from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex-1 min-h-dvh bg-app flex flex-col lg:flex-row font-sans">

            {/* Bagian 1: Desain & Maskot (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 lg:shrink-0 lg:sticky lg:top-0 lg:h-dvh bg-brand-primary flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-brand-secondary rounded-full blur-[80px] opacity-30 pointer-events-none"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-brand-accent rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

                {/* Maskot */}
                <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 animate-[floatMascot_4s_ease-in-out_infinite]">
                    <Image
                        src="/mascot/dino.png"
                        alt="Mascot Dinosaku"
                        fill
                        priority
                        className="object-contain drop-shadow-xl"
                    />
                </div>

                {/* Bayangan Maskot */}
                <div className="relative w-full h-4 mt-2">
                    <div className="absolute left-1/2 -translate-x-1/2 w-28 h-2 bg-black/10 rounded-full blur-[3px] animate-[mascotShadow_4s_ease-in-out_infinite]"></div>
                </div>

                <div className="relative z-10 text-center text-balance">
                    <h1 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-heading text-white tracking-tight">
                        Selamat Datang!
                    </h1>
                    <p className="mt-2 md:mt-3 text-sm md:text-base text-white/80 max-w-xs md:max-w-sm px-4 md:px-0 mx-auto">
                        Mari berpetualang dan belajar bersama Dinosaku.
                    </p>
                </div>
            </div>

            {/* Bagian 2: Content (Register/Login Form) */}
            <div className="flex-1 flex flex-col p-4 sm:p-8 md:p-12 lg:py-16 lg:px-24 bg-gradient-to-br from-surface-soft to-white relative">
                <div className="w-full max-w-lg mx-auto my-auto py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
