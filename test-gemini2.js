const { GoogleGenAI, Type } = require('@google/genai');

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: 'Hello',
    });
    console.log("SUCCESS:", response.text);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}
main();

