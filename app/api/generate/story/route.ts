import { NextResponse } from 'next/server';
import { generateStoryAndQuiz } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { materi, tema } = await req.json();
    if (!materi || !tema) {
      return NextResponse.json({ error: 'Materi and tema are required' }, { status: 400 });
    }

    const data = await generateStoryAndQuiz(materi, tema);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/generate/story:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}
