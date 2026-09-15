import { NextResponse } from 'next/server';
import { generateComicImage } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.startsWith('[MOCK]')) {
      // Return a fast placeholder for Demo POC
      return NextResponse.json({ imageUrl: 'https://placehold.co/600x600/064E2B/FFFFFF?text=Ilustrasi+Dino+Menabung' });
    }

    const imageUrl = await generateComicImage(prompt);
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error in /api/generate/image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
