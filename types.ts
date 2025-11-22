export enum House {
  Gryffindor = 'Gryffindor',
  Slytherin = 'Slytherin',
  Ravenclaw = 'Ravenclaw',
  Hufflepuff = 'Hufflepuff',
  Neutral = 'Neutral'
}

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
  wand?: string;
  patronus?: string;
  
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