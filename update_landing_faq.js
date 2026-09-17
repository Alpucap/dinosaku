const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf-8');

if (!code.includes('import FAQ')) {
  code = code.replace(
    'import SubscriptionCTA from "@/components/SubscriptionCTA";',
    'import SubscriptionCTA from "@/components/SubscriptionCTA";\nimport FAQ from "@/components/FAQ";'
  );
}

const oldSection = `<SubscriptionCTA />

          <SectionWave
            above="bg-surface"
            below="var(--color-surface-green)"
            variant="a"
          />`;

const newSection = `<SubscriptionCTA />

          <SectionWave
            above="bg-surface"
            below="var(--color-surface-soft)"
            variant="a"
          />

          <FAQ />

          <SectionWave
            above="bg-surface-soft"
            below="var(--color-surface-green)"
            variant="b"
          />`;

if (code.includes(oldSection)) {
  code = code.replace(oldSection, newSection);
  fs.writeFileSync('app/page.tsx', code);
  console.log("Updated page.tsx with FAQ");
} else {
  console.log("Could not find the section to replace");
}
