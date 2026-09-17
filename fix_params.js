const fs = require('fs');
let code = fs.readFileSync('app/api/pembimbing/kelas/[id]/route.ts', 'utf-8');
code = code.replace(/const \{ id \} = context.params;/g, 'const { id } = await context.params;');
fs.writeFileSync('app/api/pembimbing/kelas/[id]/route.ts', code);
