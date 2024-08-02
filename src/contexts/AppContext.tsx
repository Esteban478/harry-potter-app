import { createContext, useState, ReactNode } from 'react';
import { Character, Spell } from '../types';
import { AppContextType } from '../types/context';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{ characters, setCharacters, spells, setSpells, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};