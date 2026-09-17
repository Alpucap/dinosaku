const fs = require('fs');
let code = fs.readFileSync('app/pembimbing/kelas/ClassManagerClient.tsx', 'utf-8');

const target = `<div className="mt-4 pt-4 border-t border-border-light flex justify-between items-center text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {cls._count?.students || 0} Murid
              </span>
            </div>`;

const replacement = `<div className="mt-4 pt-4 border-t border-border-light flex justify-between items-center text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {cls._count?.students || 0} Murid
              </span>
              <a href={\`/pembimbing/kelas/\${cls.id}\`} className="text-brand-primary font-bold hover:underline">Kelola Murid &rarr;</a>
            </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('app/pembimbing/kelas/ClassManagerClient.tsx', code);
