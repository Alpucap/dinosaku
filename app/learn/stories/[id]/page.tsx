import React from 'react';
import { PRESET_STORIES } from '@/lib/data/preset-stories';
import PresetStoryViewer from '@/components/dino/PresetStoryViewer';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return PRESET_STORIES.map((story) => ({
    id: story.id,
  }));
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = PRESET_STORIES.find((s) => s.id === id);

  if (!story) {
    notFound();
  }

  return <PresetStoryViewer story={story} storyId={story.id} />;
}
