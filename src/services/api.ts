import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Character, Spell, Options, DailyData } from '../types';

const API_BASE_URL = 'https://hp-api.onrender.com/api';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function getCachedData<T>(
  collectionName: string,
  docId: string,
  fetchFunction: () => Promise<T[]>
): Promise<T[]> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const { data, timestamp } = docSnap.data();
    if (Date.now() - timestamp < CACHE_EXPIRATION) {
      return data as T[];
    }
  }

  const freshData = await fetchFunction();
  await setDoc(docRef, { data: freshData, timestamp: Date.now() });
  return freshData;
}

async function fetchFromAPI<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}`);
  }
  return response.json();
}

export const fetchCharacters = (): Promise<Character[]> =>
  getCachedData<Character>('appData', 'characters', () => fetchFromAPI<Character>('/characters'));

export const fetchSpells = (): Promise<Spell[]> =>
  getCachedData<Spell>('appData', 'spells', () => fetchFromAPI<Spell>('/spells'));

export const fetchRandomCharacter = async (): Promise<Character> => {
  const characters = await fetchCharacters();
  return characters[Math.floor(Math.random() * characters.length)];
};

export const fetchRandomSpell = async (): Promise<Spell> => {
  const spells = await fetchSpells();
  return spells[Math.floor(Math.random() * spells.length)];
};

export const fetchOptions = async (): Promise<Options> => {
  const optionsDoc = await getDoc(doc(db, 'options', 'all'));
  if (optionsDoc.exists()) {
    return optionsDoc.data() as Options;
  } else {
    throw new Error('Options not found');
  }
};

export const fetchDailyData = async (): Promise<DailyData> => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dailyDocRef = doc(db, 'daily', today);
  const dailyDoc = await getDoc(dailyDocRef);

  if (dailyDoc.exists()) {
    return dailyDoc.data() as DailyData;
  } else {
    const newDailyData = await generateNewDailyData();
    await setDoc(dailyDocRef, newDailyData);
    return newDailyData;
  }
};

const generateNewDailyData = async (): Promise<DailyData> => {
  const characters = await fetchCharacters();
  const spells = await fetchSpells();

  const mainCharacters = characters.filter(char => char.image);
  const randomCharacter = mainCharacters[Math.floor(Math.random() * mainCharacters.length)];
  const randomSpell = spells[Math.floor(Math.random() * spells.length)];

  return {
    character: randomCharacter,
    spell: randomSpell,
    date: new Date().toISOString().split('T')[0],
  };
};