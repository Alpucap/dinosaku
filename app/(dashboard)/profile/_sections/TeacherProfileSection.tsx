import { Briefcase, Users } from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
                    <Input
                        type="text"
                        placeholder="Contoh: SDN 1 Menteng, SD Al-Azhar..."
                        value={formData.schoolName ?? ''}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        list="school-suggestions"
                        className="mt-1"
                        suppressHydrationWarning
                    />
                    <datalist id="school-suggestions">
                        {DUMMY_SCHOOLS.map((school) => (
                            <option key={school.id} value={school.name}>
                                {school.name} ({school.city})
                            </option>
                        ))}
                    </datalist>
                    <p className="text-xs text-text-muted mt-1.5">
                        Ketik bebas nama sekolah tempat Anda mengajar.
                    </p>
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
