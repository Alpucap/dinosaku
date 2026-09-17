const fs = require('fs');
let code = fs.readFileSync('lib/auth/session.ts', 'utf-8');

// Replace classCode line and add joinedClasses
code = code.replace(
  'classCode: user.classCode || undefined,',
  'classCode: undefined, // deprecated\\n      joinedClasses: (user as any).joinedClasses || [],\\n      ownedClasses: (user as any).ownedClasses || [],'
);

fs.writeFileSync('lib/auth/session.ts', code);
console.log("Session updated.");
