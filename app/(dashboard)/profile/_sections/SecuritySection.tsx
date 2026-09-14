import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

interface Props {
    passwordForm: any;
    setPasswordForm: any;
    errors: Record<string, string>;
    handleSavePassword: () => void;
    isSavingPassword: boolean;
}

export function SecuritySection({ passwordForm, setPasswordForm, errors, handleSavePassword, isSavingPassword }: Props) {
    return (
        <Card>
            <CardContent className="p-4 md:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Keamanan Akun</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="md:col-span-2 lg:col-span-1">
                        <FieldLabel>Password Saat Ini</FieldLabel>
                        <Input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            aria-invalid={!!errors.currentPassword}
                            suppressHydrationWarning
                        />
                        {errors.currentPassword && <FieldError>{errors.currentPassword}</FieldError>}
                    </Field>

                    {/* Empty div for layout balancing on large screens */}
                    <div className="hidden lg:block"></div>

                    <Field>
                        <FieldLabel>Password Baru</FieldLabel>
                        <Input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            aria-invalid={!!errors.newPassword}
                            suppressHydrationWarning
                        />
                        {errors.newPassword && <FieldError>{errors.newPassword}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel>Konfirmasi Password Baru</FieldLabel>
                        <Input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            aria-invalid={!!errors.confirmPassword}
                            suppressHydrationWarning
                        />
                        {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
                    </Field>
                </div>

                <div className="flex justify-end pt-4 border-t mt-6">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={handleSavePassword}
                        disabled={isSavingPassword || !passwordForm.current || !passwordForm.new || !passwordForm.confirm}
                        suppressHydrationWarning
                    >
                        {isSavingPassword ? 'Menyimpan...' : 'Perbarui Password'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
