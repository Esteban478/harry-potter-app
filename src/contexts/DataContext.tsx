import { createContext, useState, useEffect, ReactNode } from 'react';
import { Character, Spell, Options } from '../types';
import { fetchCharacters, fetchSpells, fetchOptions } from '../services/api';
import { DataContextType } from '../types/context';

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [options, setOptions] = useState<Options | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCharacters, fetchedSpells, fetchedOptions] = await Promise.all([
          fetchCharacters(),
          fetchSpells(),
          fetchOptions()
        ]);
        setCharacters(fetchedCharacters);
        setSpells(fetchedSpells);
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
    <DataContext.Provider value={{ characters, spells, options, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};