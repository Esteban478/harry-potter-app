import { Spell } from '../types';

interface SpellCardProps {
  spell: Spell;
}

const SpellCard: React.FC<SpellCardProps> = ({ spell }) => {
  return (
    <div className="card spell-card">
      <img src="placeholder-spell.jpg" alt={spell.name} />
      <div className='card-content'>
        <h3>{spell.name}</h3>
        <p>{spell.description}</p>
      </div>
    </div>
  );
};

export default SpellCard;