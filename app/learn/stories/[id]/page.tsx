import React from 'react';
import { prisma } from '@/lib/prisma';
import PresetStoryViewer from '@/components/dino/PresetStoryViewer';
import { notFound } from 'next/navigation';

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const dbStory = await prisma.story.findUnique({
    where: { id }
  });

  if (!dbStory) {
    notFound();
  }

  const story = {
    id: dbStory.id,
    title: dbStory.title,
    ...(dbStory.pagesData as any)
  };

  return <PresetStoryViewer story={story} storyId={story.id} />;
}
