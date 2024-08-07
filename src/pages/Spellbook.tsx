import { useEffect, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { fetchSpells } from '../services/api';
import SpellCard from '../components/SpellCard';
import '../styles/General.css';
import '../styles/Spellbook.css';

const Spellbook: React.FC = () => {
  const { spells, setSpells, loading, setLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSpells = async () => {
      setLoading(true);
      try {
        const fetchedSpells = await fetchSpells();
        setSpells(fetchedSpells);
      } catch (error) {
        console.error('Error fetching spells:', error);
      } finally {
        setLoading(false);
      }
    };

    if (spells.length === 0) {
      loadSpells();
    }
  }, [spells.length, setSpells, setLoading]);

  const filteredSpells = spells.filter((spell) =>
    spell.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="spellbook-page">
      <h1>Spellbook</h1>
      <input
        type="text"
        placeholder="Search spells..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <p>Loading spells...</p>
      ) : (
        <div className="spells-grid">
          {filteredSpells.map((spell) => (
            <SpellCard key={spell.id} spell={spell} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Spellbook;