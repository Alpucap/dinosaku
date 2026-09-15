import assert from 'node:assert/strict';
import { readFileSync, mkdirSync } from 'node:fs';
import ts from 'typescript';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
const base = process.env.TEST_BASE_URL || 'http://localhost:3102';
const artifacts = process.env.TEST_ARTIFACTS || '/tmp/dinosaku-gamification';
mkdirSync(artifacts, { recursive: true });
const compiled = ts.transpileModule(readFileSync('lib/data/preset-stories.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { PRESET_STORIES } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await context.route('https://placehold.co/**', route => route.fulfill({ contentType: 'image/png', body: readFileSync('public/mascot/dino.png') }));
let apiCalls = 0;
let fail = false;
let malformed = false;
await context.route('**/api/generate/story', route => {
  apiCalls++;
  return route.fulfill({ status: fail ? 500 : 200, contentType: 'application/json', body: JSON.stringify(fail ? { error: 'Test failure' } : malformed ? { story: { title: 'Incomplete', panels: [{}], quiz: [{}] } } : { story: { ...PRESET_STORIES[0], panels: PRESET_STORIES[0].panels.map(panel => ({ ...panel, imageUrl: '/mascot/dino.png' })) } }) });
});
await context.route('**/api/generate/image', route => { apiCalls++; return route.abort(); });

async function go(path) {
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
  await page.locator('main').waitFor();
  await page.locator('.learning-sidebar[data-ready="true"]').waitFor();
}
async function quiz(story, wrongFirst = false) {
  await page.getByRole('button', { name: 'Lanjut ke Kuis!' }).click();
  for (const [index, question] of story.quiz.entries()) {
    const answer = wrongFirst && index === 0 ? question.options.find(option => option !== question.correctAnswer) : question.correctAnswer;
    await page.getByRole('button', { name: answer, exact: false }).click();
    await page.getByRole('button', { name: index === story.quiz.length - 1 ? 'Lihat Hasil' : 'Pertanyaan Berikutnya', exact: true }).click();
  }
  await page.getByRole('status').filter({ hasText: 'Progres tersimpan' }).waitFor();
}
try {
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/learn/stories', '/learn/badges', '/learn/leaderboard', '/learn']) {
      await go(path);
      await page.waitForTimeout(650);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth || [...document.querySelectorAll('main')].some(e => e.scrollWidth > e.clientWidth)), false, `Overflow: ${path} at ${width}`);
      await page.screenshot({ path: `${artifacts}/${path.split('/').pop()}-${width}.png`, fullPage: true });
    }
  }
  console.log('PASS: all four learning pages fit 320, 768, 1024 and 1440 px');
  await page.setViewportSize({ width: 390, height: 900 });
  await go('/learn/stories');
  await page.getByRole('link', { name: 'Mainkan', exact: true }).click();
  await quiz(PRESET_STORIES[0], true);
  assert.equal(await page.getByRole('form').count(), 0);
  await page.getByRole('button', { name: 'Selesai & Kembali ke Peta' }).click();
  await page.getByText('Nilai terbaik: 4 / 5').waitFor();
  await page.getByRole('link', { name: 'Mainkan lagi' }).click();
  await quiz(PRESET_STORIES[0]);
  await page.getByText('Penabung Ulung', { exact: true }).waitFor();
  await page.screenshot({ path: `${artifacts}/quiz-perfect.png`, fullPage: true });
  await go('/learn/badges');
  await page.getByText('3 dari 5 terbuka').waitFor();
  await go('/learn/leaderboard');
  assert.match(await page.locator('.ranking-list').innerText(), /100/);
  await page.getByLabel('Tambahkan petualang').fill('Bima');
  await page.getByRole('button', { name: 'Tambah profil', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Profil Bima siap belajar.' }).waitFor();
  await go('/learn/badges');
  await page.getByText('0 dari 5 terbuka').waitFor();
  await go('/learn/stories/kebutuhan-hutan-ajaib');
  await page.getByRole('heading', { name: 'Petualangan ini masih terkunci' }).waitFor();
  console.log('PASS: quiz scores, perfect badges, independent profiles and locked deep links');

  await go('/learn');
  await page.getByRole('button', { name: /Demo POC/ }).click();
  await page.getByRole('button', { name: 'Mulai Petualangan!' }).click();
  await page.getByRole('button', { name: 'Lanjut ke Kuis!' }).waitFor();
  assert.equal(apiCalls, 0, 'Demo must not use any generation API');
  await go('/learn');
  fail = true;
  await page.getByRole('button', { name: 'Mulai Petualangan!' }).click();
  await page.getByRole('alert').waitFor();
  await page.getByText('3 dari 3 energi tersisa hari ini').waitFor();
  fail = false;
  malformed = true;
  await page.getByRole('button', { name: 'Mulai Petualangan!' }).click();
  await page.getByRole('alert').filter({ hasText: 'Isi cerita belum lengkap' }).waitFor();
  await page.getByText('3 dari 3 energi tersisa hari ini').waitFor();
  malformed = false;
  for (let i = 0; i < 3; i++) {
    await go('/learn');
    await page.getByText(`${3 - i} dari 3 energi tersisa hari ini`).waitFor();
    await page.getByRole('button', { name: 'Mulai Petualangan!' }).click();
    await page.getByRole('button', { name: 'Lanjut ke Kuis!' }).waitFor();
  }
  await go('/learn');
  assert.equal(await page.getByRole('button', { name: 'Energi habis hari ini' }).isDisabled(), true);
  await go('/learn/leaderboard');
  await page.getByRole('button', { name: 'Petualang', exact: true }).click();
  await go('/learn');
  assert.equal(await page.getByRole('button', { name: 'Energi habis hari ini' }).isDisabled(), true);
  await page.getByRole('button', { name: /Demo POC/ }).click();
  assert.equal(await page.getByRole('button', { name: 'Mulai Petualangan!' }).isEnabled(), true);
  console.log('PASS: free demo, failed request refunds energy, quota persists and is shared by profiles');
  await go('/learn/leaderboard');
  await page.getByRole('button', { name: 'Ubah nama profil aktif' }).click();
  await page.getByLabel('Ubah nama Petualang').fill('Dina');
  await page.getByRole('button', { name: 'Simpan nama' }).click();
  await page.getByRole('status').filter({ hasText: 'Profil Dina siap belajar.' }).waitFor();
  await page.getByLabel('Tambahkan petualang').fill('Bima');
  await page.getByRole('button', { name: 'Tambah profil', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Nama itu sudah dipakai' }).waitFor();
  await go('/learn/badges');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate(element => document.activeElement === element), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('main').evaluate(element => document.activeElement === element), true);
  console.log('PASS: rename, duplicate profile validation and keyboard skip navigation');
  assert.deepEqual(errors, []);
  console.log('PASS: no uncaught browser errors');

  const blocked = await browser.newContext({ reducedMotion: 'reduce' });
  await blocked.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Test storage unavailable', 'QuotaExceededError'); };
  });
  await blocked.route('https://placehold.co/**', route => route.fulfill({ contentType: 'image/png', body: readFileSync('public/mascot/dino.png') }));
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(`${base}/learn/stories/${PRESET_STORIES[0].id}`, { waitUntil: 'domcontentloaded' });
  await blockedPage.getByRole('button', { name: 'Lanjut ke Kuis!' }).click();
  for (const [index, question] of PRESET_STORIES[0].quiz.entries()) {
    await blockedPage.getByRole('button', { name: question.correctAnswer }).click();
    await blockedPage.getByRole('button', { name: index === 4 ? 'Lihat Hasil' : 'Pertanyaan Berikutnya', exact: true }).click();
  }
  await blockedPage.getByRole('status').filter({ hasText: 'Penyimpanan browser tidak tersedia.' }).first().waitFor();
  await blockedPage.getByText('Penabung Ulung', { exact: true }).waitFor();
  await blocked.close();
  console.log('PASS: blocked storage preserves in-session quiz results and displays a notice');
} catch (error) {
  console.log('Failure page:', page.url(), await page.locator('main').innerText());
  await page.screenshot({ path: `${artifacts}/failure.png`, fullPage: true });
  throw error;
} finally { await browser.close(); }
