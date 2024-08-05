import { createContext, useState, useEffect, ReactNode } from 'react';
import { Character, Spell, Options, Potion } from '../types';
import { fetchCharacters, fetchSpells, fetchOptions, fetchPotions } from '../services/api';
import { DataContextType } from '../types/context';

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [potions, setPotions] = useState<Potion[]>([]);
  const [options, setOptions] = useState<Options | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCharacters, fetchedSpells, fetchedPotions, fetchedOptions] = await Promise.all([
          fetchCharacters(),
          fetchSpells(),
          fetchPotions(),
          fetchOptions()
        ]);
        setCharacters(fetchedCharacters);
        setSpells(fetchedSpells);
        setPotions(fetchedPotions);
        setOptions(fetchedOptions);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ characters, spells, potions, options, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};