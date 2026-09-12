import { Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/lib/data/dummy-users';

interface Props {
    formData: User;
    handlePreferencesChange: (checked: boolean) => void;
    isSavingPrefs: boolean;
}

// Preferensi notifikasi
export function PreferencesSection({ formData, handlePreferencesChange, isSavingPrefs }: Props) {
    return (
        <Card>
            <CardContent className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">Pengaturan & Privasi</h3>
                    </div>
                    {isSavingPrefs && <span className="text-xs text-muted-foreground animate-pulse">Menyimpan...</span>}
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-xl bg-surface-soft transition-colors">
                    <Checkbox
                        id="notifications"
                        checked={formData.preferences?.notificationsEnabled || false}
                        onCheckedChange={handlePreferencesChange}
                        className="mt-1"
                        disabled={isSavingPrefs}
                    />
                    <div className="space-y-1 leading-none">
                        <label
                            htmlFor="notifications"
                            className="text-sm font-medium leading-none cursor-pointer"
                        >
                            Terima Notifikasi Email
                        </label>
                        <p className="text-sm text-muted-foreground">
                            Dapatkan laporan perkembangan belajar, info paket terbaru, dan pembaruan sistem dari Dinosaku.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
