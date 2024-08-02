import { Spell } from '../types';

interface SpellCardProps {
  spell: Spell;
}

const SpellCard: React.FC<SpellCardProps> = ({ spell }) => {
  return (
    <div className="spell-card">
      <h3>{spell.name}</h3>
      <p>{spell.description}</p>
    </div>
  );
};

export default SpellCard;