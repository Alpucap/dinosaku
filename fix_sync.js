const fs = require('fs');
let code = fs.readFileSync('app/learn/page.tsx', 'utf-8');

const target = `    // Auto-refresh misi setiap 5 detik`;

const replacement = `    async function syncProgressOnLoad() {
      if (!ready) return;
      try {
        const { getPoints, getBadges, getStreak, readProgress } = await import('@/lib/progress');
        const state = readProgress();
        const profile = state.profiles.find(p => p.id === state.activeProfileId);
        if (profile) {
          await fetch('/api/progress/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              totalPoints: getPoints(profile),
              badges: getBadges(profile),
              currentStreak: getStreak(profile.studyDays)
            })
          });
        }
      } catch(e) {}
    }
    
    if (ready) {
      syncProgressOnLoad();
    }

    // Auto-refresh misi setiap 5 detik`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('app/learn/page.tsx', code);
  console.log("Successfully injected background sync on dashboard load!");
} else {
  console.log("Could not find injection target.");
}
