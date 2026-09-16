const fs = require('fs');
let code = fs.readFileSync('app/pembimbing/cerita/CeritaClient.tsx', 'utf-8');

// Replace the string interpolation for finalTheme
code = code.replace(
  'const finalTheme = character ? `${theme} dengan tokoh utama ${character}` : theme;',
  'const finalTheme = character ? `${theme} dengan Purba sang Dino yang memakai kostum/berperan sebagai ${character}` : theme;'
);

// Replace the UI for the Character field
const oldField = `            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="block text-sm font-bold text-text-secondary">Karakter Utama (Opsional)</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setCharacter('Dinosaurus')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Dinosaurus</button>
                  <button onClick={() => setCharacter('Robot Pintar')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Robot Pintar</button>
                  <button onClick={() => setCharacter('Ksatria')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Ksatria</button>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Contoh: Dinosaurus bernama Purba, atau Robot Terbang"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors font-medium text-text-primary"
              />
            </div>`;

const newField = `            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="block text-sm font-bold text-text-secondary">Peran / Kostum Purba (Opsional)</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setCharacter('Astronot')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Astronot</button>
                  <button onClick={() => setCharacter('Detektif')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Detektif</button>
                  <button onClick={() => setCharacter('Ksatria')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Ksatria</button>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Contoh: Astronot, Detektif, Pahlawan Super"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors font-medium text-text-primary"
              />
            </div>`;

code = code.replace(oldField, newField);

fs.writeFileSync('app/pembimbing/cerita/CeritaClient.tsx', code);
