import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  try {
    const file = fs.readFileSync('public/mascot/dino.png');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        "Describe this dinosaur mascot in great detail for an image generation prompt. Focus on its physical features, colors, shape, eyes, clothing (if any), and overall style so that an AI image generator can reproduce it consistently.",
        { inlineData: { data: file.toString('base64'), mimeType: 'image/png' } }
      ],
    });
    console.log(response.text);
  } catch (err) {
    console.error("FAILED:", err);
  }
}
main();
