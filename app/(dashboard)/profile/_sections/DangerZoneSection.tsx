import { LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
    handleLogout: () => void;
}

export function DangerZoneSection({ handleLogout }: Props) {
    return (
        <Card>
            <CardContent className="px-4 py-3 md:px-6 md:py-4 flex flex-col gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-destructive">Zona Berbahaya</h3>
                    <p className="text-muted-foreground text-sm">
                        Tindakan ini akan mengakhiri sesi Anda saat ini. Anda harus masuk kembali untuk mengakses Dinosaku.
                    </p>
                </div>
                <Button
                    className="bg-destructive text-white hover:bg-destructive/90 w-full sm:w-auto"
                    onClick={handleLogout}
                    suppressHydrationWarning
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar (Log Out)
                </Button>
            </CardContent>
        </Card>
    );
}
