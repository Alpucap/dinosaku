import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { NextResponse } from 'next/server.js';

test('story response exposes the story field consumed by DinoApp', async () => {
  const story = {
    title: 'Purba Menabung',
    panels: [{ text: 'Purba menyimpan koin.', imagePrompt: 'Purba saving coins' }],
    quiz: [{ question: 'Apa yang Purba simpan?', options: ['Koin'], correctAnswer: 'Koin', insight: 'Menabung sedikit demi sedikit.' }],
  };
  const source = readFileSync('app/api/generate/story/route.ts', 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    console,
    require(id) {
      if (id === 'next/server') return { NextResponse };
      if (id === '@/lib/gemini') return {
        generateStoryAndQuiz: async (materi, tema) => {
          assert.equal(materi, 'Menabung');
          assert.equal(tema, 'Luar Angkasa');
          return story;
        },
      };
      throw new Error(`Unexpected import: ${id}`);
    },
  });
  const response = await exports.POST(new Request('http://localhost/api/generate/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ materi: 'Menabung', tema: 'Luar Angkasa' }),
  }));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).story, story);
});
