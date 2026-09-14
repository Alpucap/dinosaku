import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { story, images } = await req.json();

    if (!story || !images) {
      return NextResponse.json({ error: 'Missing story or images' }, { status: 400 });
    }

    // Only allow in development mode for safety
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Only allowed in development mode' }, { status: 403 });
    }

    const storyId = story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'presets', storyId);

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Process and save images
    const savedStory = { ...story, id: storyId, description: `Cerita petualangan tentang ${story.title}`, coverImage: '' };
    
    // Save panel images
    for (let i = 0; i < savedStory.panels.length; i++) {
      const base64Str = images[i];
      if (base64Str && base64Str.startsWith('data:image')) {
        const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, "");
        const filename = `panel${i + 1}.jpg`;
        fs.writeFileSync(path.join(imagesDir, filename), base64Data, 'base64');
        savedStory.panels[i].imageUrl = `/images/presets/${storyId}/${filename}`;
      } else if (base64Str) { // If it's already a URL
        savedStory.panels[i].imageUrl = base64Str;
      }
    }

    // Pick panel 1 as cover image for now
    if (savedStory.panels[0]?.imageUrl) {
      savedStory.coverImage = savedStory.panels[0].imageUrl;
    }

    // Append to JSON file
    const jsonPath = path.join(process.cwd(), 'lib', 'data', 'generated-stories.json');
    let allStories = [];
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf8');
      try {
        allStories = JSON.parse(content);
      } catch (e) {
        console.error("Invalid JSON in generated-stories.json");
      }
    }

    // Avoid duplicates by title
    const existingIndex = allStories.findIndex((s: any) => s.id === storyId);
    if (existingIndex >= 0) {
      allStories[existingIndex] = savedStory;
    } else {
      allStories.push(savedStory);
    }

    fs.writeFileSync(jsonPath, JSON.stringify(allStories, null, 2));

    return NextResponse.json({ success: true, storyId });
  } catch (error) {
    console.error('Error saving preset:', error);
    return NextResponse.json({ error: 'Failed to save preset' }, { status: 500 });
  }
}
