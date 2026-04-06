import { GoogleGenAI, Type } from "@google/genai";
import { CreatureInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function identifyCreature(base64Image: string): Promise<CreatureInfo> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Identify this creature and provide detailed information in JSON format. Include common name, scientific name, rarity (COMMON, UNCOMMON, RARE, EPIC, LEGENDARY), a short fun fact description, habitat, diet, dangerLevel (Low, Medium, High), combat stats (aggression, camouflage, speed, defense from 1-10). IMPORTANT: For videos, provide 2 DIRECT YouTube video URLs (e.g., https://www.youtube.com/watch?v=...) about this creature and their exact titles. Do not use search query links. Return ONLY the JSON.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          commonName: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          rarity: { type: Type.STRING, enum: ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"] },
          description: { type: Type.STRING },
          habitat: { type: Type.STRING },
          diet: { type: Type.STRING },
          dangerLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          stats: {
            type: Type.OBJECT,
            properties: {
              aggression: { type: Type.NUMBER },
              camouflage: { type: Type.NUMBER },
              speed: { type: Type.NUMBER },
              defense: { type: Type.NUMBER },
            },
            required: ["aggression", "camouflage", "speed", "defense"],
          },
          videos: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING, description: "A direct youtube watch URL" },
              },
            },
          },
        },
        required: ["commonName", "scientificName", "rarity", "description", "habitat", "diet", "dangerLevel", "stats", "videos"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to identify creature");
  
  // 1. SCRUB THE TEXT: Remove markdown formatting if Gemini accidentally includes it
  const cleanText = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
  
  let data;
  try {
    // 2. PARSE SAFELY
    data = JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", cleanText);
    throw new Error("Invalid response format from AI");
  }
  
  // 3. Fallback just in case Gemini STILL returns a search string instead of a raw link
  if (data.videos) {
    data.videos = data.videos.map((v: any) => ({
      ...v,
      url: v.url.startsWith('http') ? v.url : `https://www.youtube.com/results?search_query=${encodeURIComponent(v.title)}`
    }));
  }

  return data as CreatureInfo;
}
