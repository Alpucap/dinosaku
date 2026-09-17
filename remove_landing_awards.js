const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf-8');

// Remove import statement
code = code.replace('import AwardsBanner from "@/components/AwardsBanner";\n', '');
code = code.replace('import AwardsBanner from "@/components/AwardsBanner";', '');

// Remove the component usage
const target = `          {/* AWARDS BANNER */}
          <AwardsBanner />`;

if (code.includes(target)) {
  code = code.replace(target, '');
  fs.writeFileSync('app/page.tsx', code);
  console.log("Successfully removed AwardsBanner from app/page.tsx");
} else {
  console.log("Could not find AwardsBanner in app/page.tsx");
}
