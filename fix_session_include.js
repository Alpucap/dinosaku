const fs = require('fs');
let code = fs.readFileSync('lib/auth/session.ts', 'utf-8');

code = code.replace(
  'gamification: true,',
  'gamification: true,\\n        joinedClasses: true,\\n        ownedClasses: true,'
);

// We should also replace the (user as any) hack
code = code.replace(
  'joinedClasses: (user as any).joinedClasses || [],',
  'joinedClasses: user.joinedClasses || [],'
);
code = code.replace(
  'ownedClasses: (user as any).ownedClasses || [],',
  'ownedClasses: user.ownedClasses || [],'
);

fs.writeFileSync('lib/auth/session.ts', code);
console.log("Session include updated.");
