require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function listAll() {
  try {
    const response = await ai.models.list();
    const textModels = [];
    const imageModels = [];
    const proModels = [];
    
    for await (const model of response) {
      if (model.name.includes('image')) {
        imageModels.push(model.name);
      } else if (model.name.includes('pro')) {
        proModels.push(model.name);
      } else {
        textModels.push(model.name);
      }
    }
    
    console.log("--- TEXT & MULTIMODAL (FLASH) ---");
    console.log(textModels.join('\n'));
    console.log("\n--- IMAGE GENERATION ---");
    console.log(imageModels.join('\n'));
    console.log("\n--- TEXT & MULTIMODAL (PRO) ---");
    console.log(proModels.join('\n'));
    
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}
listAll();
