import { useState } from 'react';
import { useData } from '../hooks/useDataContext';
import PotionCard from '../components/PotionCard';
import PotionDetail from '../components/PotionDetail';
import { Potion } from '../types';
import '../styles/Potions.css';

const Potions: React.FC = () => {
  const { potions, loading, error } = useData();
  const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPotions = potions.filter(potion =>
    potion.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading potions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="potions-page">
      <h1>Potions</h1>
      <input
        type="text"
        placeholder="Search potions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="potions-grid">
        {filteredPotions.map(potion => (
          <PotionCard
            key={potion.id}
            potion={potion}
            onClick={() => setSelectedPotion(potion)}
          />
        ))}
      </div>
      {selectedPotion && (
        <PotionDetail
          potion={selectedPotion}
          onClose={() => setSelectedPotion(null)}
        />
      )}
    </div>
  );
};

export default Potions;