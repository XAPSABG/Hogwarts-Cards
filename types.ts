
export enum House {
  Gryffindor = 'Gryffindor',
  Slytherin = 'Slytherin',
  Ravenclaw = 'Ravenclaw',
  Hufflepuff = 'Hufflepuff',
  Neutral = 'Neutral'
}

export type UserTier = 'free' | 'paid';

export interface Ability {
  name: string;
  cost: string;
  description: string;
}

export interface CharacterStats {
  magic: number;
  courage: number;
  intelligence: number;
  cunning: number;
  loyalty: number;
}

export interface WandData {
  wood: string;
  core: string;
  length: string;
  flexibility: string;
}

export interface CardData {
  name: string;
  house: House;
  type: string; // e.g., "Legendary Wizard", "Magical Beast"
  subType?: string; // e.g., "Human", "Goblin"
  hp: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Mythic';
  abilities: Ability[];
  flavorText: string;
  stats: CharacterStats;
  
  // Identity & Lore
  wand: WandData;
  patronus: string;
  boggart: string;
  bloodStatus: string; // e.g. Pure-blood, Half-blood
  bestSubject: string; // e.g. Potions, Charms
  titles: string[]; // e.g. Prefect, Head Boy, Auror
  
  // The Grand Update: Deep Lore
  animagus: string | null; // "Tabby Cat (Square markings around eyes)" or null
  familiar: string; // "Hedwig (Snowy Owl)"
  mirrorOfErised: string; // "Seeing his parents alive and happy"
  amortentia: string[]; // ["Treacle Tart", "Broomstick handle wood", "Ginny's hair"]
  dangerLevel: number; // 1-10 Scale
  affiliations: string[]; // ["Order of the Phoenix", "Dumbledore's Army"]
  signatureSpell: string; // "Expelliarmus"

  // Expanded Profile Data
  biography: string;
  strengths: string[];
  weaknesses: string[];
  equipment: string[];
  
  visualDescription: string; // Used for image generation prompt
}

export interface AppState {
  cardData: CardData | null;
  imageUrl: string | null;
  isLoadingData: boolean;
  isLoadingImage: boolean;
  error: string | null;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16";

export const IMAGE_STYLES = [
  "Fantasy Oil Painting",
  "Cinematic Photorealistic",
  "Vintage Book Illustration",
  "Watercolor Art",
  "Dark Fantasy",
  "Anime Style",
  "3D Render"
] as const;

export type ImageStyle = typeof IMAGE_STYLES[number];
