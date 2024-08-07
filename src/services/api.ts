import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, deleteDoc, doc, updateDoc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { Character, Spell, Options, DailyData, Comment, Potion, UserProfile } from '../types';

const API_BASE_URL = 'https://hp-api.onrender.com/api';
const POTTERDB_API_BASE_URL = 'https://api.potterdb.com/v1';
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

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      console.log(`No user found with ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const generateNewDailyData = async (): Promise<DailyData> => {
  const characters = await fetchCharacters();
  const spells = await fetchSpells();
  const potions = await fetchPotions();

  const mainCharacters = characters.filter(char => char.image);
  const randomCharacter = mainCharacters[Math.floor(Math.random() * mainCharacters.length)];
  const randomSpell = spells[Math.floor(Math.random() * spells.length)];
  const randomPotion = potions[Math.floor(Math.random() * potions.length)];

  return {
    character: randomCharacter,
    spell: randomSpell,
    potion: randomPotion,
    date: new Date().toISOString().split('T')[0],
  };
};

export const addComment = async (
  content: string,
  userId: string,
  characterId?: string,
  potionId?: string
) => {
  console.log('addComment called with:', { content, userId, characterId, potionId });
  const commentsRef = collection(db, 'comments');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newComment: any = {
    content,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  if (characterId) {
    newComment.characterId = characterId;
  } else if (potionId) {
    newComment.potionId = potionId;
  } else {
    throw new Error('Either characterId or potionId must be provided');
  }

  try {
    const docRef = await addDoc(commentsRef, newComment);
    console.log('Comment added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getComments = async (characterId?: string, potionId?: string): Promise<Comment[]> => {
  console.log('getComments called with:', { characterId, potionId });
  const commentsRef = collection(db, 'comments');
  let q;

  if (characterId) {
    q = query(
      commentsRef,
      where('characterId', '==', characterId),
      orderBy('createdAt', 'desc')
    );
  } else if (potionId) {
    q = query(
      commentsRef,
      where('potionId', '==', potionId),
      orderBy('createdAt', 'desc')
    );
  } else {
    console.error('Neither characterId nor potionId provided');
    return [];
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log('Query snapshot:', querySnapshot);
    const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
    console.log('Parsed comments:', comments);
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const updateComment = async (commentId: string, content: string) => {
  const commentRef = doc(db, 'comments', commentId);
  return updateDoc(commentRef, {
    content,
    updatedAt: Timestamp.now(),
  });
};

export const deleteComment = async (commentId: string) => {
  const commentRef = doc(db, 'comments', commentId);
  return deleteDoc(commentRef);
};

export const fetchPotions = async (): Promise<Potion[]> => {
  console.log('Fetching potions from API...');
  const response = await fetch(`${POTTERDB_API_BASE_URL}/potions`);
  if (!response.ok) {
    throw new Error('Failed to fetch potions');
  }
  const data = await response.json();
  console.log('Fetched potions:', data.data);
  return data.data as Potion[];
};

export const fetchPotionById = async (id: string): Promise<Potion> => {
  console.log('Fetching potion from API...');
  const response = await fetch(`${POTTERDB_API_BASE_URL}/potions/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch potion');
  }
  const data = await response.json();
  console.log('Fetched potion:', data.data);
  return data.data as Potion;
};

export const storePotionsInFirestore = async (potions: Potion[]): Promise<void> => {
  console.log('Storing potions in Firestore...');
  const batch = writeBatch(db);
  potions.forEach((potion) => {
    const potionRef = doc(db, 'potions', potion.id);
    batch.set(potionRef, potion);
  });
  await batch.commit();
  console.log('Potions stored in Firestore');
};

export const getPotionsFromFirestore = async (): Promise<Potion[]> => {
  console.log('Getting potions from Firestore...');
  const potionsRef = collection(db, 'potions');
  const snapshot = await getDocs(potionsRef);
  const potions = snapshot.docs.map(doc => doc.data() as Potion);
  console.log('Potions from Firestore:', potions);
  return potions;
};