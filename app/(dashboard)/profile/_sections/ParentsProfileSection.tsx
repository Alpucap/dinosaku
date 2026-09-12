import { Crown, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/data/dummy-users';

interface Props {
    user: User;
    premiumChildrenCount: number;
    myChildren: User[];
}

export function ParentsProfileSection({ user, premiumChildrenCount, myChildren }: Props) {
    return (
        <>
            {/* Lisensi & Penagihan */}
            <Card className={user.plan === 'premium' ? "border-t-4 border-t-warning bg-warning-soft shadow-none" : "shadow-none"}>
                <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={user.plan === 'premium' ? "bg-warning p-3 rounded-full text-warning-foreground" : "bg-muted p-3 rounded-full text-muted-foreground"}>
                            <Crown className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Lisensi & Penagihan</h3>
                            <p className="text-sm text-muted-foreground">
                                Anda memiliki <span className="font-bold">{premiumChildrenCount} Lisensi Premium</span> yang aktif digunakan oleh akun anak.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" suppressHydrationWarning className="w-full sm:w-auto shrink-0">Beli Lisensi Tambahan</Button>
                </CardContent>
            </Card>

            {/* Akun anak yang terhubung */}
            <Card>
                <CardContent className="p-4 md:p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Akun Anak yang Terhubung</h3>
                    </div>
                    {myChildren.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myChildren.map(child => (
                                <div key={child.id} className="flex flex-col items-center text-center gap-3 p-5 border rounded-xl bg-surface-soft h-full relative">
                                    <div className="absolute top-3 right-3">
                                        {child.plan === 'premium' ? (
                                            <Badge className="bg-warning text-warning-foreground hover:bg-warning shadow-none text-[10px] px-1.5">Premium</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground shadow-none text-[10px] px-1.5 border-muted-foreground/30">Free</Badge>
                                        )}
                                    </div>

                                    {/* Avatar anak */}
                                    <div className="h-16 w-16 rounded-full overflow-hidden bg-brand-secondary/30 shrink-0 mt-2">
                                        {child.avatarUrl ? (
                                            <img src={child.avatarUrl} alt={child.fullName} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="h-full w-full flex items-center justify-center text-xl font-bold text-brand-primary">
                                                {child.fullName.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Nama & Username anak */}
                                    <div className="w-full px-2">
                                        <p className="font-semibold text-sm truncate">{child.fullName}</p>
                                        <p className="text-xs text-muted-foreground truncate">@{child.username}</p>
                                    </div>

                                    {child.plan === 'free' && (
                                        <Button size="sm" className="w-full bg-warning text-warning-foreground hover:bg-warning/90 font-semibold mt-auto" suppressHydrationWarning>
                                            Berikan Akses Premium
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Belum ada akun anak yang ditambahkan.</p>
                    )}
                    <Button variant="outline" className="w-full sm:w-auto" suppressHydrationWarning>Tambah Akun Anak Baru</Button>
                </CardContent>
            </Card>
        </>
    );
}
