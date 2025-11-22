import { GoogleGenAI, Type } from "@google/genai";
import { CardData, House } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for Character Data
const characterSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    house: { 
      type: Type.STRING, 
      enum: [
        House.Gryffindor, 
        House.Slytherin, 
        House.Ravenclaw, 
        House.Hufflepuff, 
        House.Neutral
      ] 
    },
    type: { type: Type.STRING, description: "Card Class, e.g., 'Legendary Wizard', 'Creature', 'Artifact'" },
    subType: { type: Type.STRING, description: "Species or role, e.g., 'Human Student', 'Goblin', 'Dragon'" },
    hp: { type: Type.INTEGER, description: "Hit points/Defense, between 1 and 20" },
    rarity: { type: Type.STRING, enum: ['Common', 'Uncommon', 'Rare', 'Mythic'] },
    abilities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          cost: { type: Type.STRING, description: "Mana cost string. Use numbers for generic cost and letters for specific sources: 'R' (Gryffindor/Red), 'S' (Slytherin/Green), 'B' (Ravenclaw/Blue), 'H' (Hufflepuff/Yellow), 'D' (Dark Arts/Black), 'W' (Light/White). Example: '2RR' or '1SD'." },
          description: { type: Type.STRING, description: "Very short description (max 20 words)." },
        },
        required: ['name', 'cost', 'description']
      },
      description: "Generate exactly 2 or 3 abilities. No more than 3."
    },
    flavorText: { type: Type.STRING, description: "Short poetic flavor text, max 1 sentence." },
    stats: {
      type: Type.OBJECT,
      properties: {
        magic: { type: Type.INTEGER, description: "0-100" },
        courage: { type: Type.INTEGER, description: "0-100" },
        intelligence: { type: Type.INTEGER, description: "0-100" },
        cunning: { type: Type.INTEGER, description: "0-100" },
        loyalty: { type: Type.INTEGER, description: "0-100" },
      },
      required: ['magic', 'courage', 'intelligence', 'cunning', 'loyalty']
    },
    wand: { type: Type.STRING, description: "Wood, core, length, flexibility" },
    patronus: { type: Type.STRING },
    biography: { type: Type.STRING, description: "A 3-4 sentence backstory or biography." },
    strengths: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3 key personality or magical strengths."
    },
    weaknesses: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 1-2 key weaknesses or flaws."
    },
    equipment: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 1-3 notable items carried (e.g., Invisibility Cloak, Remembrall)."
    },
    visualDescription: { 
      type: Type.STRING, 
      description: "A comprehensive art prompt. Describe the character's physical appearance (hair, eyes, distinct features), attire (robes, armor, etc), and a dynamic pose (e.g. casting a specific spell, brewing potions). CRITICAL: Describe the background environment in detail reflecting their lore (e.g. 'The dimly lit Potions dungeon', 'The stormy Astronomy Tower', 'The Ministry Atrium'). Specify lighting (e.g. 'Green magical glow', 'Warm candlelight'). Style: Fantasy oil painting. Do not describe card borders." 
    }
  },
  required: ['name', 'house', 'type', 'hp', 'rarity', 'abilities', 'flavorText', 'stats', 'visualDescription', 'biography', 'strengths', 'weaknesses', 'equipment']
};

export const generateCharacterData = async (prompt: string): Promise<CardData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a detailed trading card profile for a Harry Potter universe character based on: "${prompt}". 
      
      Rules:
      1. If the input matches a canon character, use accurate lore.
      2. If the input is generic (e.g., "Auror"), create a unique character.
      3. Ensure ability costs use TCG style notation (R/S/B/H/D/W).
      4. The output must be valid JSON matching the schema.
      5. Make the biography sound like an official Ministry of Magic record.
      6. For 'visualDescription', you MUST include detailed environment, lighting, and pose instructions to ensure a masterpiece image.
      7. IMPORTANT: Generate MAXIMUM 3 abilities. Keep ability descriptions VERY concise (under 20 words) to fit on the card.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: characterSchema,
        systemInstruction: "You are a master game designer and Harry Potter lore expert.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from Gemini.");
    return JSON.parse(text) as CardData;

  } catch (error) {
    console.error("Error generating character data:", error);
    throw error;
  }
};

export const generateCharacterImage = async (visualPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: `High fantasy oil painting in the style of Magic The Gathering art. Detailed masterpiece, 8k resolution, dramatic cinematic lighting. Subject centered in frame. ${visualPrompt}
          
          IMPORTANT: Generate the artwork ONLY. Do NOT include any card frames, borders, text, stats, or UI elements. The image should be a full-bleed character illustration.`
        }]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3" // Landscape ratio to fit card art box
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data generated.");
  } catch (error) {
    console.error("Error generating image:", error);
    return `https://picsum.photos/400/300?grayscale&blur=2`;
  }
};