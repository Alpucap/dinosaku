const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf-8');

if (!code.includes('import Testimonial')) {
  code = code.replace(
    'import SubscriptionCTA from "@/components/SubscriptionCTA";',
    'import SubscriptionCTA from "@/components/SubscriptionCTA";\nimport Testimonial from "@/components/Testimonial";'
  );
}

const oldSection = `<SectionWave
            above="bg-surface-soft"
            below="var(--color-surface)"
            variant="b"
          />

          {/* SUBSCRIPTION CTA SECTION */}
          <SubscriptionCTA />`;

const newSection = `<SectionWave
            above="bg-surface-soft"
            below="var(--color-surface)"
            variant="b"
          />

          {/* TESTIMONIAL SECTION */}
          <Testimonial />

          {/* SUBSCRIPTION CTA SECTION */}
          <SubscriptionCTA />`;

if (code.includes(oldSection)) {
  code = code.replace(oldSection, newSection);
  fs.writeFileSync('app/page.tsx', code);
  console.log("Updated page.tsx with Testimonial");
} else {
  console.log("Could not find the section to replace");
}
