import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync('lib/progress.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const progress = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('replaying a quiz retains the best score without duplicating points', () => {
  const profile = progress.createProfile('p1', 'Purba');
  const first = progress.applyQuizResult(profile, 'saving', 4, 5, '2026-09-13');
  const replay = progress.applyQuizResult(first, 'saving', 2, 5, '2026-09-13');
  assert.equal(progress.getPoints(replay), 80);
  assert.equal(replay.results.length, 1);
  assert.equal(replay.studyDays.length, 1);
  const perfect = progress.applyQuizResult(replay, 'saving', 5, 5, '2026-09-14');
  assert.equal(progress.getPoints(perfect), 100);
  assert.ok(progress.getBadges(perfect).includes('perfect'));
  assert.ok(!progress.getBadges(replay).includes('perfect'));
});

test('streak counts calendar days once and expires after a missed day', () => {
  const days = ['2026-08-31', '2026-09-01', '2026-09-02'];
  assert.equal(progress.getStreak(days, '2026-09-02'), 3);
  assert.equal(progress.getStreak(days, '2026-09-03'), 3);
  assert.equal(progress.getStreak(days, '2026-09-04'), 0);
  assert.equal(progress.getStreak(['2024-02-28', '2024-02-29', '2024-03-01'], '2024-03-01'), 3);
});

test('legacy progress is retained and invalid storage is rejected', () => {
  const state = progress.parseProgress(null, '["first",12,"first"]');
  assert.deepEqual(state.profiles[0].completedStories, ['first']);
  assert.equal(progress.parseProgress('{bad').profiles[0].name, 'Petualang');
  assert.equal(progress.parseProgress('{"profiles":[null]}').profiles.length, 1);
});

test('quota reserves at most three slots, refunds failure and resets tomorrow', () => {
  let state = progress.parseProgress(null);
  for (let i = 0; i < 3; i++) state = progress.reserveEnergy(state, String(i), '2026-09-13');
  assert.equal(progress.getEnergy(state, '2026-09-13'), 0);
  assert.throws(() => progress.reserveEnergy(state, 'four', '2026-09-13'));
  state = progress.refundEnergy(state, '1');
  assert.equal(progress.getEnergy(state, '2026-09-13'), 1);
  assert.equal(progress.getEnergy(state, '2026-09-14'), 3);
});

test('invalid scores are rejected instead of earning badges', () => {
  const profile = progress.createProfile('p1', 'Purba');
  for (const [score, total] of [[6, 5], [-1, 5], [0, 0], [1.5, 5]]) {
    assert.throws(() => progress.applyQuizResult(profile, 'saving', score, total, '2026-09-13'));
  }
});

test('local calendar dates do not shift with UTC serialization', () => {
  const date = new Date(2026, 8, 13, 0, 1);
  assert.equal(progress.localDay(date), '2026-09-13');
});

test('a streak badge is retained after the active streak expires', () => {
  const profile = progress.createProfile('p1', 'Purba');
  profile.studyDays = ['2026-09-01', '2026-09-02', '2026-09-03'];
  assert.equal(progress.getStreak(profile.studyDays, '2026-09-13'), 0);
  assert.ok(progress.getBadges(profile).includes('streak'));
});

test('switching profiles does not reset shared energy or copy scores', () => {
  let state = progress.parseProgress(null);
  state = progress.reserveEnergy(state, 'attempt', '2026-09-13');
  state.profiles.push(progress.createProfile('p2', 'Bima'));
  state.activeProfileId = 'p2';
  state.profiles[0] = progress.applyQuizResult(state.profiles[0], 'saving', 5, 5, '2026-09-13');
  const restored = progress.parseProgress(JSON.stringify(state));
  assert.equal(progress.getEnergy(restored, '2026-09-13'), 2);
  assert.equal(progress.getPoints(restored.profiles[1]), 0);
  assert.equal(progress.getPoints(restored.profiles[0]), 100);
});
