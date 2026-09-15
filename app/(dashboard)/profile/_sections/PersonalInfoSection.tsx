import { Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/data/dummy-users';
import { TeacherProfileSection } from './TeacherProfileSection';

interface Props {
    user: User;
    formData: User;
    setFormData: React.Dispatch<React.SetStateAction<User>>;
    errors: Record<string, string>;
    isChild: boolean;
    isTeacher: boolean;
    handleSaveProfile: () => void;
    isSavingProfile: boolean;
}

export function PersonalInfoSection({ user, formData, setFormData, errors, isChild, isTeacher, handleSaveProfile, isSavingProfile }: Props) {
    return (
        <Card>
            <CardContent className="p-4 md:p-6 space-y-4">
                <h3 className="text-xl font-semibold">
                    Informasi Pribadi
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel>Nama Lengkap</FieldLabel>
                        <Input
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            aria-invalid={!!errors.fullName}
                            disabled={isChild}
                            suppressHydrationWarning
                        />
                        {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel>Username</FieldLabel>
                        <Input
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            aria-invalid={!!errors.username}
                            disabled={isChild}
                            suppressHydrationWarning
                        />
                        {errors.username && <FieldError>{errors.username}</FieldError>}
                    </Field>

                    {/* Jika bukan anak-anak, tampilkan email */}
                    {!isChild && (
                        <Field className="md:col-span-2">
                            <FieldLabel>Alamat Email</FieldLabel>
                            <Input
                                value={user.email}
                                disabled
                                suppressHydrationWarning
                            />
                            <p className="text-sm text-muted-foreground mt-2">Email tidak dapat diubah. Hubungi bantuan jika Anda kehilangan akses.</p>
                        </Field>
                    )}

                    {/* Anak tidak bisa ubah nama/username */}
                    {isChild && (
                        <div className="md:col-span-2 flex items-center gap-2 p-3 bg-warning-soft rounded-lg text-warning-foreground text-sm">
                            <Lock className="h-4 w-4 shrink-0 text-warning" />
                            <p>Hanya Orang Tua (Parents) yang dapat mengubah nama dan username kamu menggunakan PIN Keamanan.</p>
                        </div>
                    )}

                    {/* Guru punya kolom Identitas Profesional */}
                    {isTeacher && (
                        <TeacherProfileSection formData={formData} setFormData={setFormData} />
                    )}
                </div>

                {!isChild && (
                    <div className="flex justify-end pt-4 border-t mt-6">
                        <Button
                            className="bg-brand-accent text-primary hover:bg-brand-accent-hover font-medium shadow-sm w-full sm:w-auto"
                            onClick={handleSaveProfile}
                            disabled={isSavingProfile || (formData.fullName === user.fullName && formData.username === user.username && formData.schoolId === user.schoolId)}
                            suppressHydrationWarning
                        >
                            {isSavingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
