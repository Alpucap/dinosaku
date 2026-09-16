import React from 'react';
import { prisma } from '@/lib/prisma';
import PresetStoryViewer from '@/components/dino/PresetStoryViewer';
import { notFound } from 'next/navigation';

export default async function TeacherStoryPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ pendingAssign?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const pendingAssign = sp.pendingAssign;
  
  const dbStory = await prisma.story.findUnique({
    where: { id }
  });

  if (!dbStory) {
    notFound();
  }

  let pagesData = dbStory.pagesData;
  if (typeof pagesData === 'string') {
    try {
      pagesData = JSON.parse(pagesData);
    } catch(e) {}
  }

  const story = {
    id: dbStory.id,
    title: dbStory.title,
    ...(pagesData as any)
  };

  return <PresetStoryViewer story={story} storyId={story.id} returnUrl="/pembimbing/koleksi" pendingAssign={pendingAssign} />;
}
