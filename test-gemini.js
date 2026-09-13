const { GoogleGenAI, Type } = require('@google/genai');

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: 'AIzaSyByEJMaWN3OOHr4pM79RvV8w-21Gpcs_bc' });
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: 'Hello',
    });
    console.log(response.text);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}
main();

