const fs = require('fs');
let code = fs.readFileSync('app/learn/page.tsx', 'utf-8');

// hapus yang lama
const toRemove = `    async function syncProgressOnLoad() {
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
    }`;

if (code.includes(toRemove)) {
  code = code.replace(toRemove, "");
  
  const toInject = `  useEffect(() => {
    async function syncProgressOnLoad() {
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
    
    syncProgressOnLoad();
  }, [ready]);

  useEffect(() => {`;

  code = code.replace("  useEffect(() => {", toInject);
  fs.writeFileSync('app/learn/page.tsx', code);
  console.log("Successfully fixed useEffect for background sync!");
}
