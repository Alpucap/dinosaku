const fs = require('fs');

// 1. Fix page.tsx
let pageStr = fs.readFileSync('app/pembimbing/cerita/page.tsx', 'utf-8');
pageStr = pageStr.replace("import { getUser } from '@/lib/auth/lucia';", "import { getSessionUser } from '@/lib/auth/session';");
pageStr = pageStr.replace("await getUser();", "await getSessionUser();");
fs.writeFileSync('app/pembimbing/cerita/page.tsx', pageStr);

// 2. Fix actions.ts
let actStr = fs.readFileSync('app/pembimbing/cerita/actions.ts', 'utf-8');
actStr = actStr.replace("import { getUser } from '@/lib/auth/lucia';", "import { getSessionUser } from '@/lib/auth/session';");
actStr = actStr.replace(/import \{ generateImagePrompt \} from '@\/lib\/gemini-image';\n/g, "");
actStr = actStr.replace(/await getUser\(\);/g, "await getSessionUser();");
actStr = actStr.replace(/const pagesData = storyData\.panels\.map\(p => \(\{/g, "const pagesData = storyData.panels.map((p: any) => ({");
fs.writeFileSync('app/pembimbing/cerita/actions.ts', actStr);

// 3. Fix CeritaClient.tsx
let cliStr = fs.readFileSync('app/pembimbing/cerita/CeritaClient.tsx', 'utf-8');
cliStr = cliStr.replace("import { toast } from 'sonner';", "import { toast } from '@/components/ui/toast';");
cliStr = cliStr.replace(/toast\.error\((.*?)\);/g, "toast.add({ title: $1, type: 'error' });");
cliStr = cliStr.replace(/toast\.success\((.*?)\);/g, "toast.add({ title: $1, type: 'success' });");
fs.writeFileSync('app/pembimbing/cerita/CeritaClient.tsx', cliStr);

console.log("Done");
