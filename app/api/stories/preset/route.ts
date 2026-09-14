import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      where: {
        isPreset: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Parse the pagesData JSON field back to objects
    const formattedStories = stories.map(story => ({
      id: story.id,
      title: story.title,
      themeLabel: story.theme || 'Taman Bermain',
      description: `Cerita petualangan tentang ${story.title}`,
      coverImage: (story.pagesData as any)?.panels?.[0]?.imageUrl || '',
      ...(story.pagesData as any) // Include panels, quiz, etc.
    }));

    return NextResponse.json({ stories: formattedStories });
  } catch (error) {
    console.error('Error fetching preset stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}
