import { Briefcase } from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field';
import { DUMMY_SCHOOLS } from '@/lib/data/dummy-schools';
import { User } from '@/lib/data/dummy-users';

interface Props {
    formData: User;
    setFormData: React.Dispatch<React.SetStateAction<User>>;
}

export function TeacherProfileSection({ formData, setFormData }: Props) {
    return (
        <Field className="md:col-span-2 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-semibold">Identitas Profesional</h4>
            </div>
            <FieldLabel>Nama Sekolah / Institusi</FieldLabel>
            <select
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
        </Field>
    );
}
