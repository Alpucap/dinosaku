'use client';
import Link from "next/link";
import { GraduationCap, Star, Zap, Flame, Lock, Medal, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User } from '@/lib/data/dummy-users';
import { useProgress } from '@/lib/use-progress';
import { BADGES } from '@/lib/progress';
import BadgeMedal from '@/components/dino/BadgeMedal';

interface Props {
    user: User;
    myTeacher: User | null;
}

export function ChildrenProfileSection({ user, myTeacher }: Props) {
    const { profile, points: localPoints, streak: localStreak, badges: localBadges, ready } = useProgress();
    
    // Fallback to dummy data if no profile (Server Side Rendering or not started)
    const totalPoints = ready && profile ? localPoints : (user.gamification?.totalPoints || 0);
    const currentStreak = ready && profile ? localStreak : (user.gamification?.currentStreak || 0);
    const unlockedBadges = ready && profile ? localBadges : [];
    const totalBadges = ready && profile ? unlockedBadges.length : (user.gamification?.totalBadges || 0);

    return (
        <>
            {/* Classroom section */}
            {user.classCode && myTeacher ? (
                <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 flex items-start sm:items-center gap-4">
                    <div className="bg-brand-primary/10 text-brand-primary p-2.5 rounded-lg shrink-0">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-brand-primary">Ruang Kelas Aktif</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Kamu sedang tergabung di kelas <span className="font-medium text-foreground">{myTeacher.fullName}</span>.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-surface-soft/50 border border-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="shrink-0 pt-0.5">
                        <GraduationCap className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Belum Terhubung ke Kelas</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Minta kode dari gurumu untuk mulai belajar bersama!
                        </p>
                    </div>
                    <div className="flex w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
                        <Link href="/learn/kelas">
                            <Button variant="outline" className="text-brand-primary border-brand-primary hover:bg-brand-primary/5" suppressHydrationWarning>Masuk ke Kelasku</Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Prestasiku */}
            <Card className="shadow-sm">
                <CardContent className="p-4 md:p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-brand-accent/10">
                        <Star className="text-warning h-5 w-5 fill-warning" />
                        <h3 className="text-lg font-semibold text-foreground">Prestasiku</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-surface border border-border flex items-center gap-4 shadow-sm">
                            <div className="bg-warning-soft p-2 rounded-md">
                                <Zap className="h-5 w-5 text-warning" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Poin</p>
                                <p className="text-xl font-bold text-brand-primary">
                                    {totalPoints.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-surface border border-border flex items-center gap-4 shadow-sm">
                            <div className="bg-red-50 p-2 rounded-md">
                                <Flame className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Streak Harian</p>
                                <p className="text-xl font-bold text-brand-primary">
                                    {currentStreak}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-surface border border-border flex items-center gap-4 shadow-sm">
                            <div className="bg-info-soft p-2 rounded-md">
                                <Medal className="h-5 w-5 text-info" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Lencana</p>
                                <p className="text-xl font-bold text-brand-primary">
                                    {totalBadges}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="pt-4 mt-2 border-t border-brand-accent/10">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-sm text-brand-primary uppercase tracking-wider">Koleksi Lencanaku</h4>
                            <Dialog>
                                <DialogTrigger
                                    render={
                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-brand-primary hover:text-brand-primary-hover hover:bg-brand-primary/5" />
                                    }
                                >
                                    Lihat Semua
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Semua Lencana</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-6 gap-x-4 py-4">
                                        {BADGES.map((badge) => {
                                            const isUnlocked = unlockedBadges.includes(badge.id);
                                            return (
                                                <div key={badge.id} className={`flex flex-col items-center gap-2 ${isUnlocked ? '' : 'opacity-50'}`} title={`${badge.name}: ${badge.description}`}>
                                                    <BadgeMedal id={badge.id} unlocked={isUnlocked} />
                                                    <span className="text-xs font-medium text-center text-foreground">{badge.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {BADGES.slice(0, 5).map((badge) => {
                                const isUnlocked = unlockedBadges.includes(badge.id);
                                return (
                                    <div key={badge.id} className={`flex flex-col items-center gap-2 w-24 ${isUnlocked ? '' : 'opacity-50'}`} title={`${badge.name}: ${badge.description}`}>
                                        <BadgeMedal id={badge.id} unlocked={isUnlocked} />
                                        <span className="text-xs font-medium text-center text-foreground">{badge.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
