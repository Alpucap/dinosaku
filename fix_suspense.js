const fs = require('fs');
let code = fs.readFileSync('app/pembimbing/anak/page.tsx', 'utf-8');
code = code.replace(
  'import AnakListClient from "./AnakListClient";',
  'import AnakListClient from "./AnakListClient";\nimport { Suspense } from "react";'
);
code = code.replace(
  '<AnakListClient',
  '<Suspense fallback={<div className="animate-pulse h-64 bg-surface rounded-xl"></div>}>\n        <AnakListClient'
);
code = code.replace(
  'role={guardian.role} \n      />',
  'role={guardian.role} \n      />\n      </Suspense>'
);
fs.writeFileSync('app/pembimbing/anak/page.tsx', code);
