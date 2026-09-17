const fs = require('fs');
let code = fs.readFileSync('app/(dashboard)/profile/_sections/TeacherProfileSection.tsx', 'utf-8');

const target = `                <div className="p-4 bg-surface-soft border border-border-light rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <KeyRound className="h-4 w-4 text-brand-primary" />
                        <h5 className="font-bold text-sm">Kode Kelas</h5>
                    </div>
                    <div className="font-mono font-bold text-lg bg-white border px-3 py-1.5 rounded-lg inline-block shadow-sm">
                        {formData.classCode || 'BELUM-ADA'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Berikan kode ini kepada murid agar mereka terhubung ke kelas Anda.</p>
                </div>`;

const replacement = `                <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl flex items-center justify-between">
                    <div>
                        <h5 className="font-bold text-brand-primary flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Manajemen Kelas
                        </h5>
                        <p className="text-sm text-text-secondary mt-1">Buat kelas dan kelola daftar murid Anda di menu Manajemen Kelas.</p>
                    </div>
                </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('app/(dashboard)/profile/_sections/TeacherProfileSection.tsx', code);
  console.log("Successfully replaced classCode view in TeacherProfileSection!");
} else {
  console.log("Could not find the target string.");
}
