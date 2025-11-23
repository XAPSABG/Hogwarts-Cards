
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
      description: "Generate exactly 2 abilities."
    },
    signatureSpell: { type: Type.STRING, description: "The character's most famous or frequent spell. e.g. 'Expelliarmus' for Harry." },
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
    // New Deep Lore Fields
    wand: {
      type: Type.OBJECT,
      properties: {
        wood: { type: Type.STRING, description: "e.g. Holly, Yew, Vine" },
        core: { type: Type.STRING, description: "e.g. Phoenix Feather, Dragon Heartstring" },
        length: { type: Type.STRING, description: "e.g. 11 inches" },
        flexibility: { type: Type.STRING, description: "e.g. Supple, Unyielding, Whippy" }
      },
      required: ['wood', 'core', 'length', 'flexibility']
    },
    patronus: { type: Type.STRING, description: "Corporeal patronus form, e.g. Stag, Otter. If Dark Wizard, put 'None' or 'Maggots'." },
    boggart: { type: Type.STRING, description: "Greatest fear form." },
    bloodStatus: { type: Type.STRING, enum: ['Pure-blood', 'Half-blood', 'Muggle-born', 'Squib', 'Half-breed', 'Unknown'] },
    bestSubject: { type: Type.STRING, description: "Best Hogwarts subject, e.g. Potions, Charms, Transfiguration." },
    titles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Honorifics or roles, e.g. 'Prefect', 'Head Boy', 'Auror', 'Death Eater'. Max 3." },
    
    // Grand Update Fields
    animagus: { type: Type.STRING, description: "Animal form if applicable, else null. Include distinctive markings. e.g. 'Black Dog', 'Beetle with glasses markings'."},
    familiar: { type: Type.STRING, description: "Animal companion name and species. e.g. 'Hedwig (Snowy Owl)', 'Crookshanks (Kneazle)'."},
    mirrorOfErised: { type: Type.STRING, description: "What they see in the Mirror of Erised (Deepest Desires)."},
    amortentia: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 specific smells they love (Amortentia potion). e.g. 'Freshly mown grass', 'New parchment'."},
    dangerLevel: { type: Type.INTEGER, description: "Ministry threat assessment level 1-10. 1 is harmless, 10 is Voldemort level threat."},
    affiliations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Organizations they belong to. e.g. 'Order of the Phoenix', 'Slug Club', 'Dumbledore's Army', 'Death Eaters'."},

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
      description: "A comprehensive art prompt. If the character is a known canon figure (e.g. Harry Potter, Snape, Hermione), you MUST describe their specific physical traits (face, hair, scars) exactly as they appear in the movies/books to ensure a recognizable likeness. Describe attire, dynamic pose, and detailed environment/lighting. Style: Fantasy oil painting." 
    }
  },
  required: ['name', 'house', 'type', 'hp', 'rarity', 'abilities', 'signatureSpell', 'flavorText', 'stats', 'visualDescription', 'biography', 'strengths', 'weaknesses', 'equipment', 'wand', 'patronus', 'boggart', 'bloodStatus', 'bestSubject', 'titles', 'familiar', 'mirrorOfErised', 'amortentia', 'dangerLevel', 'affiliations']
};

export const generateCharacterData = async (prompt: string): Promise<CardData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a detailed Ministry of Magic Personnel File for a Harry Potter universe character based on: "${prompt}". 
      
      Rules:
      1. If the input matches a canon character (e.g. "Harry Potter"), you MUST use accurate lore.
      2. If the input is generic (e.g., "Auror"), create a unique character.
      3. BE CREATIVE with the 'Psychological Profile' (Amortentia/Mirror of Erised).
      4. 'dangerLevel' should be accurate. Students are usually 1-3. Aurors 4-6. Dark Wizards 7-10.
      5. The output must be valid JSON matching the schema.
      6. For 'visualDescription', you MUST include detailed environment, lighting, and pose instructions.
      7. IMPORTANT: Generate exactly 2 standard abilities + 1 Signature Spell.
      8. Amortentia smells should be evocative and specific to the character's loves.`,
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

export const generateCharacterImage = async (visualPrompt: string, characterName?: string): Promise<string> => {
  try {
    // We construct the prompt to prioritize likeness without triggering "Real Person" safety filters.
    // Explicitly asking for "actor likeness" often triggers refusals.
    // Asking for "Accurate character portrayal" is safer and effective.
    const nameInstruction = characterName 
      ? `Subject: ${characterName}. Portray the character with accurate features described in the books and movies.` 
      : "Subject: A wizarding world character.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: `High quality fantasy oil painting, Magic The Gathering style. 
          ${nameInstruction}
          Visual Context: ${visualPrompt}
          
          Cinematic lighting, highly detailed. Full bleed illustration, no text.`
        }]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3" // Landscape ratio to fit card art box
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    
    console.warn("Gemini returned a response but no image data found. It may have been filtered.");
    // Fallback to transparent pixel instead of throwing to prevent UI crash
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  } catch (error) {
    console.error("Error generating image:", error);
    // Return a simple transparent pixel to avoid Tainted Canvas errors if generation fails
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }
};
