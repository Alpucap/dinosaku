import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminProfileSection() {
    return (
        <Card className="bg-brand-primary text-white shadow-md border-none">
            <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full text-white">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Akses Administrator Utama</h3>
                        <p className="text-sm text-white/80 mt-1">Anda memiliki kendali penuh atas sistem Dinosaku. Kelola pengguna, peran, dan sekolah di Dashboard Admin.</p>
                    </div>
                </div>
                <Button className="w-full sm:w-auto bg-white text-brand-primary hover:bg-surface-soft font-semibold shrink-0" suppressHydrationWarning>
                    Buka Dashboard Admin
                </Button>
            </CardContent>
        </Card>
    );
}
