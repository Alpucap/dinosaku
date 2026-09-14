import localforage from 'localforage';
import { StoryData } from '@/components/dino/DinoApp';

export interface SavedStory extends StoryData {
  id: string;
  savedAt: number;
}

const collectionStore = localforage.createInstance({
  name: 'dinosaku',
  storeName: 'story_collection'
});

export async function saveStoryToCollection(story: StoryData, images: Record<number, string>) {
  // Replace the imageUrls with the generated base64 images
  const panelsWithImages = story.panels.map((panel, i) => ({
    ...panel,
    imageUrl: images[i] || panel.imageUrl
  }));

  const storyToSave: SavedStory = {
    ...story,
    panels: panelsWithImages,
    id: `story_${Date.now()}`,
    savedAt: Date.now()
  };

  const current = await getCollection();
  current.push(storyToSave);
  await collectionStore.setItem('stories', current);
}

export async function getCollection(): Promise<SavedStory[]> {
  const stories = await collectionStore.getItem<SavedStory[]>('stories');
  return stories || [];
}

export async function deleteStoryFromCollection(id: string) {
  const current = await getCollection();
  const updated = current.filter(story => story.id !== id);
  await collectionStore.setItem('stories', updated);
}
