import { Timestamp } from "firebase/firestore/lite";

export interface Character {
  id: string;
  name: string;
  alternate_names: string[];
  species: string;
  gender: string;
  house: string;
  dateOfBirth: string;
  yearOfBirth: number;
  wizard: boolean;
  ancestry: string;
  eyeColour: string;
  hairColour: string;
  wand: {
    wood: string;
    core: string;
    length: number;
  };
  patronus: string;
  hogwartsStudent: boolean;
  hogwartsStaff: boolean;
  actor: string;
  alternate_actors: string[];
  alive: boolean;
  image: string;
}

export interface Spell {
  id: string;
  name: string;
  description: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  nickname: string | null;
  profilePicture: string | null;
  favoriteHouse: string | null;
  favoriteSpell: string | null;
  favoriteCharacter: string | null;
  wandCore: string | null;
  wandWood: string | null;
  wandLength: number | null;
  patronus: string | null;
  quidditchPosition: 'Chaser' | 'Keeper' | 'Beater' | 'Seeker' | null;
  hogwartsYear: number | null;
  biography: string | null;
}

export interface Options {
  wandCores: string[];
  wandWoods: string[];
  patronuses: string[];
  quidditchPositions: string[];
  hogwartsYears: number[];
  houses: string[];
}

export interface DailyData {
  character: Character;
  spell: Spell;
  potion: Potion;
  date: string;
}

export interface Comment {
  id: string;
  characterId?: string;
  potionId?: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Potion {
  id: string;
  attributes: {
    name: string;
    effect?: string;
    ingredients?: string;
    characteristics?: string;
    difficulty?: string;
    slug?: string;
    image?: string | null;
    inventors?: string[] | null;
    manufacturers?: string[] | null;
    side_effects?: string | null;
    time?: string | null;
    wiki?: string;
  };
}