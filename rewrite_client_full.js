const fs = require('fs');
let code = fs.readFileSync('app/pembimbing/cerita/CeritaClient.tsx', 'utf-8');

// Add character state
code = code.replace("const [theme, setTheme] = useState('');", "const [theme, setTheme] = useState('');\n  const [character, setCharacter] = useState('');");

// Append character to theme when calling createAndAssignStory
code = code.replace("await createAndAssignStory(topic, theme, selectedStudents);", "const finalTheme = character ? `${theme} dengan tokoh utama ${character}` : theme;\n      await createAndAssignStory(topic, finalTheme, selectedStudents);");

// Build the new UI blocks
const extraUI = `          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 flex gap-3 items-start mb-6">
            <div className="bg-white text-brand-primary p-2 rounded-lg shrink-0 shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-primary">💡 Tips AI</p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Kombinasikan topik belajar uang dengan dunia fantasi anak. AI akan meracik cerita petualangan lengkap dengan ilustrasi dan kuis interaktif secara instan!
              </p>
            </div>
          </div>

          <div className="space-y-5 flex-1">`;

const characterField = `            <div>
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

// Insert extra UI
code = code.replace('<div className="space-y-5 flex-1">', extraUI);

// Insert character field right after theme field
code = code.replace(/<input \n                type="text" \n                placeholder="Contoh: Luar Angkasa, Hutan Ajaib"[\s\S]*?<\/div>/, match => match + '\n' + characterField);

fs.writeFileSync('app/pembimbing/cerita/CeritaClient.tsx', code);
