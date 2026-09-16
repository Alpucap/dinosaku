const fs = require('fs');

let cliStr = fs.readFileSync('app/pembimbing/cerita/CeritaClient.tsx', 'utf-8');

const quickTopics = `
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-text-secondary">Topik Cerita</label>
                <div className="flex gap-2">
                  <button onClick={() => setTopic('Menabung untuk beli mainan')} className="text-[10px] bg-brand-primary/10 text-brand-primary font-bold px-2 py-1 rounded-md hover:bg-brand-primary/20">Menabung</button>
                  <button onClick={() => setTopic('Pentingnya berbagi dengan teman')} className="text-[10px] bg-info/10 text-info font-bold px-2 py-1 rounded-md hover:bg-info/20">Berbagi</button>
                  <button onClick={() => setTopic('Menghargai barang milik sendiri')} className="text-[10px] bg-brand-accent/10 text-brand-accent font-bold px-2 py-1 rounded-md hover:bg-brand-accent/20">Menghargai</button>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Contoh: Belajar menabung untuk beli sepeda"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors font-medium text-text-primary"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-text-secondary">Tema / Latar (Opsional)</label>
                <div className="flex gap-2">
                  <button onClick={() => setTheme('Luar Angkasa')} className="text-[10px] bg-surface-soft border border-border text-text-secondary font-bold px-2 py-1 rounded-md hover:bg-surface-hover">Luar Angkasa</button>
                  <button onClick={() => setTheme('Hutan Ajaib')} className="text-[10px] bg-surface-soft border border-border text-text-secondary font-bold px-2 py-1 rounded-md hover:bg-surface-hover">Hutan Ajaib</button>
                  <button onClick={() => setTheme('Kerajaan Dinosaurus')} className="text-[10px] bg-surface-soft border border-border text-text-secondary font-bold px-2 py-1 rounded-md hover:bg-surface-hover">Dinosaurus</button>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Contoh: Luar Angkasa, Hutan Ajaib"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors font-medium text-text-primary"
              />
            </div>
          </div>
`;

// Replace the old space-y-4 block
cliStr = cliStr.replace(/<div className="space-y-4">[\s\S]*?<\/div>\s*<\/div>\s*<div className="mt-8 pt-6 border-t border-border">/, quickTopics + '\n          <div className="mt-8 pt-6 border-t border-border">');

fs.writeFileSync('app/pembimbing/cerita/CeritaClient.tsx', cliStr);
