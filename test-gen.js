const { GoogleGenAI, Type } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  const materi = "Menabung";
  const tema = "Luar Angkasa";
  const prompt = `You are a creative children's book author. Write a 4-panel educational comic story for kids.`;

  try {
    console.log("Calling Gemini API...");
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
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
            }
          },
          required: ['title', 'panels']
        }
      }
    });

    console.log("SUCCESS");
    console.log(response.text);
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
  }
}

test();

