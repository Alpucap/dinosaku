const fs = require('fs');
let code = fs.readFileSync('app/learn/page.tsx', 'utf-8');

if (!code.includes('import ChildBadges')) {
  code = code.replace(
    "import LearningStats from '@/components/dino/LearningStats';",
    "import LearningStats from '@/components/dino/LearningStats';\nimport ChildBadges from '@/components/dino/ChildBadges';"
  );
}

const target = "<LearningStats />";
if (code.includes(target) && !code.includes("<ChildBadges />")) {
  code = code.replace(target, target + "\n    <ChildBadges />");
  fs.writeFileSync('app/learn/page.tsx', code);
  console.log("Updated app/learn/page.tsx with ChildBadges");
} else {
  console.log("Could not find <LearningStats /> or already injected.");
}
