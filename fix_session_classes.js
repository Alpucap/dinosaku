const fs = require('fs');
let code = fs.readFileSync('lib/auth/session.ts', 'utf-8');

code = code.replace(
  'joinedClasses: true,',
  'joinedClasses: { include: { teacher: { select: { id: true, fullName: true } } } },'
);

fs.writeFileSync('lib/auth/session.ts', code);
