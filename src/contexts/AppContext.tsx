import { createContext, useState, ReactNode } from 'react';
import { Character, Potion, Spell } from '../types';
import { AppContextType } from '../types/context';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [potions, setPotions] = useState<Potion[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{ characters, setCharacters, spells, setSpells, loading, setLoading, potions, setPotions}}>
      {children}
    </AppContext.Provider>
  );
};