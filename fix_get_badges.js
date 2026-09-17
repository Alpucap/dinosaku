const fs = require('fs');
let code = fs.readFileSync('lib/progress.ts', 'utf-8');

const target = `    ...(profile.studyDays.some(day => getStreak(profile.studyDays, day) >= 3) ? ['streak'] : []),
  ];`;

const replacement = `    ...(profile.studyDays.some(day => getStreak(profile.studyDays, day) >= 3) ? ['streak'] : []),
    ...(totalPoints >= 100 ? ['weekly-top'] : []),
    ...(totalPoints >= 500 ? ['monthly-top'] : []),
    ...(totalPoints >= 1000 ? ['gold-saver'] : []),
  ];`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('lib/progress.ts', code);
  console.log("Successfully fixed getBadges to include new badges!");
} else {
  console.log("Could not find the target string in getBadges.");
}
