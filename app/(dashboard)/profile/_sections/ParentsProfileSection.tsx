import { Crown, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/data/dummy-users';

interface Props {
    user: User;
    myChildren: User[];
}

export function ParentsProfileSection({ user, myChildren }: Props) {
    const isPremium = user.plan?.toUpperCase() === 'PREMIUM';
    const maxChildren = isPremium ? 3 : 1;
    const currentCount = myChildren.length;
    const isLimitReached = currentCount >= maxChildren;

    return (
        <>
            {/* Lisensi & Penagihan */}
            <Card className={isPremium ? "border-t-4 border-t-warning bg-warning-soft shadow-none" : "shadow-none"}>
                <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={isPremium ? "bg-warning p-3 rounded-full text-warning-foreground" : "bg-muted p-3 rounded-full text-muted-foreground"}>
                            <Crown className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Lisensi & Penagihan</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Saat ini Anda menggunakan <span className="font-bold">{isPremium ? 'Paket Premium' : 'Paket Free'}</span>.
                                <br />Batas maksimal akun anak: <span className="font-bold">{maxChildren} profil</span>.
                            </p>
                        </div>
                    </div>
                    {!isPremium && (
                        <Button variant="outline" className="w-full sm:w-auto shrink-0 bg-warning text-warning-foreground hover:bg-warning/90 border-transparent shadow-none" suppressHydrationWarning>
                            Upgrade ke Premium
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Akun anak yang terhubung */}
            <Card>
                <CardContent className="p-4 md:p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Akun Anak yang Terhubung</h3>
                        <span className="text-sm text-muted-foreground ml-auto">
                            {currentCount} / {maxChildren} digunakan
                        </span>
                    </div>
                    
                    {currentCount > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myChildren.map(child => (
                                <div key={child.id} className="flex flex-col items-center text-center gap-3 p-5 border rounded-xl bg-surface-soft h-full relative">
                                    <div className="absolute top-3 right-3">
                                        {isPremium ? (
                                            <Badge className="bg-warning text-warning-foreground hover:bg-warning shadow-none text-[10px] px-1.5">Premium</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground shadow-none text-[10px] px-1.5 border-muted-foreground/30">Free</Badge>
                                        )}
                                    </div>

                                    {/* Avatar anak */}
                                    <div className="h-16 w-16 rounded-full overflow-hidden bg-brand-secondary/30 shrink-0 mt-2">
                                        {child.avatarUrl ? (
                                            <img src={child.avatarUrl} alt={child.fullName || '?'} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="h-full w-full flex items-center justify-center text-xl font-bold text-brand-primary uppercase">
                                                {child.fullName ? child.fullName.charAt(0) : '?'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Nama & Username anak */}
                                    <div className="w-full px-2">
                                        <p className="font-semibold text-sm truncate">{child.fullName || 'Tanpa Nama'}</p>
                                        <p className="text-xs text-muted-foreground truncate">@{child.username || 'unknown'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center bg-surface-soft border border-dashed rounded-xl">
                            <p className="text-sm text-muted-foreground">Belum ada akun anak yang ditambahkan.</p>
                        </div>
                    )}

                    {!isLimitReached ? (
                        <Button variant="outline" className="w-full mt-4" suppressHydrationWarning>
                            Tambah Akun Anak Baru
                        </Button>
                    ) : (
                        <p className="text-xs text-center text-muted-foreground mt-4 italic">
                            Batas maksimal anak telah tercapai. {isPremium ? '' : 'Upgrade paket Anda untuk menambah lebih banyak.'}
                        </p>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
