import { Briefcase, Users, KeyRound } from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field';
import { DUMMY_SCHOOLS } from '@/lib/data/dummy-schools';
import { User } from '@/lib/data/dummy-users';

interface Props {
    formData: User;
    setFormData: React.Dispatch<React.SetStateAction<User>>;
    myChildrenCount?: number;
}

export function TeacherProfileSection({ formData, setFormData, myChildrenCount = 0 }: Props) {
    const maxStudents = 50;
    
    return (
        <Field className="md:col-span-2 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-semibold">Identitas Profesional & Kelas</h4>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div>
                    <FieldLabel>Nama Sekolah / Institusi</FieldLabel>
                    <select
                        className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        value={formData.schoolId || ''}
                        onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                        suppressHydrationWarning
                    >
                        <option value="" disabled>Pilih Sekolah...</option>
                        {DUMMY_SCHOOLS.map((school) => (
                            <option key={school.id} value={school.id}>
                                {school.name} ({school.city})
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl flex items-center justify-between">
                    <div>
                        <h5 className="font-bold text-brand-primary flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Manajemen Kelas
                        </h5>
                        <p className="text-sm text-text-secondary mt-1">Buat kelas dan kelola daftar murid Anda di menu Manajemen Kelas.</p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl flex items-center justify-between">
                <div>
                    <h5 className="font-bold text-brand-primary flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Kapasitas Murid
                    </h5>
                    <p className="text-sm text-text-secondary mt-1">Satu kelas dapat menampung maksimal 50 murid secara gratis.</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold font-heading text-brand-primary">{myChildrenCount}</span>
                    <span className="text-sm text-muted-foreground font-semibold"> / {maxStudents}</span>
                </div>
            </div>
        </Field>
    );
}
