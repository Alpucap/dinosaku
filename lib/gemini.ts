import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateStoryAndQuiz(materi: string, tema: string) {
const prompt = `You are a creative children's book author. Write a 4-panel educational comic story for kids. 
The educational topic (materi) requested is: "${materi}".
The theme/setting (tema) requested is: "${tema}".

CRITICAL GUARDRAIL INSTRUCTIONS:
1. FINANCE TOPIC ENFORCEMENT: The story MUST teach a financial literacy lesson (e.g., saving money, needs vs wants, earning, budgeting, delayed gratification, wise spending). If the requested 'materi' is NOT related to finance or economics, you MUST ignore the specific 'materi' request and instead write a story about "Menabung (Saving Money)".
2. SAFE THEME ENFORCEMENT: The story is for young children. The theme must be safe, positive, and age-appropriate. If the requested 'tema' contains violence, inappropriate content, adult themes, or anything negative, you MUST ignore the requested 'tema' and instead use "Taman Bermain (Playground)" as the theme.

The main character is Purba, a friendly dinosaur. Make sure to weave the financial educational topic naturally into the theme.
  
Output the story in JSON format with four keys:
1. 'themeLabel': A short 1-2 words label representing the setting/theme of the story (e.g. 'Luar Angkasa', 'Hutan Ajaib', 'Toko Mainan').
2. 'title': A catchy, fun title for the comic story (in Indonesian).
2. 'panels': an array of exactly 4 objects. Each object should have:
  - 'text': The narrative text for the panel (in Indonesian).
  - 'imagePrompt': A detailed image generation prompt (in English) for an AI image generator to create the panel. Include descriptions of the scene based on the theme. IMPORTANT: To ensure consistency, ALWAYS describe Purba exactly like this in every prompt: "A cute, chibi baby dinosaur mascot, flat vector art style. Bright lime green body, pale yellow belly, darker forest green triangular dorsal spikes down its back and tail. Big round glossy eyes, happy expression, no black outlines." Add thematic outfits (e.g. astronaut suit, safari hat) if it fits the theme.
3. 'quiz': an array of exactly 5 multiple-choice questions based on the story to test the educational understanding. Each object should have:
  - 'question': The text of the question (in Indonesian).
  - 'options': An array of exactly 3 string options (in Indonesian).
  - 'correctAnswer': The exact string of the correct option.
  - 'insight': A short encouraging explanation of why this answer is correct and the lesson learned (in Indonesian).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeLabel: { type: Type.STRING },
            title: { type: Type.STRING },
            panels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING }
                },
                required: ['text', 'imagePrompt']
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  insight: { type: Type.STRING }
                },
                required: ['question', 'options', 'correctAnswer', 'insight']
              }
            }
          },
          required: ['themeLabel', 'title', 'panels', 'quiz']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
}

export async function generateComicImage(prompt: string): Promise<string> {
  try {
    const mascotPath = path.join(process.cwd(), 'public', 'mascot', 'dino.png');
    const mascotBase64 = fs.readFileSync(mascotPath).toString('base64');

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: [
        { inlineData: { data: mascotBase64, mimeType: 'image/png' } },
        `${prompt}. Make sure the character matches the provided reference image exactly. Flat vector art style, minimalist cartoon, children's comic book illustration, no 3d rendering, vibrant solid colors, flat shading, clean design, simple background.`
      ],
    });

    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    const base64Image = inlineData?.data;
    
    if (!base64Image) {
      throw new Error("No image generated");
    }
    
    // Konversi ke WEBP menggunakan sharp untuk mengompresi ukuran secara drastis!
    const sharp = (await import('sharp')).default;
    const buffer = Buffer.from(base64Image, 'base64');
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 75 }) // Quality 75% for webp is very lightweight
      .toBuffer();
    
    const webpBase64 = webpBuffer.toString('base64');
    
    return `data:image/webp;base64,${webpBase64}`;
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a fallback or throw
    throw error;
  }
}
