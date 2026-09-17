const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf-8');

if (!code.includes('import AwardsBanner')) {
  code = code.replace(
    'import ParallaxTransition from "@/components/hero-parallax/ParallaxTransition";',
    'import ParallaxTransition from "@/components/hero-parallax/ParallaxTransition";\nimport AwardsBanner from "@/components/AwardsBanner";'
  );
}

const oldSection = `          </ParallaxTransition>

          {/* FEATURES SECTION */}`;

const newSection = `          </ParallaxTransition>

          {/* AWARDS BANNER */}
          <AwardsBanner />

          {/* FEATURES SECTION */}`;

if (code.includes(oldSection)) {
  code = code.replace(oldSection, newSection);
  fs.writeFileSync('app/page.tsx', code);
  console.log("Updated page.tsx with AwardsBanner");
} else {
  console.log("Could not find the section to replace");
}
