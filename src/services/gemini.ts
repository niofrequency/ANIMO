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
            text: "Identify this creature and provide detailed information in JSON format. Include common name, scientific name, rarity (COMMON, UNCOMMON, RARE, EPIC, LEGENDARY), a short fun fact description, habitat, diet, dangerLevel (Low, Medium, High), combat stats (aggression, camouflage, speed, defense from 1-10), and 2 relevant YouTube video titles and search queries for them. Return ONLY the JSON.",
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
                thumbnail: { type: Type.STRING, description: "A placeholder thumbnail URL or keyword for search" },
                url: { type: Type.STRING, description: "A search URL for YouTube" },
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
  
  const data = JSON.parse(text);
  
  // Enhance video data with real-looking links if they are just search terms
  data.videos = data.videos.map((v: any) => ({
    ...v,
    url: v.url.startsWith('http') ? v.url : `https://www.youtube.com/results?search_query=${encodeURIComponent(v.title)}`,
    thumbnail: `https://picsum.photos/seed/${encodeURIComponent(v.title)}/320/180`
  }));

  return data as CreatureInfo;
}
