import { Potion } from '../types';

interface PotionCardProps {
  potion: Potion;
}

const PotionCard: React.FC<PotionCardProps> = ({ potion }) => {
    const getImageSrc = () => {
        return potion.attributes.image ? potion.attributes.image : '/placeholder-potion.jpg';
    };
  return (
      <div className="card potion-card">
        <img src={getImageSrc()} alt={potion.attributes.name} />
        <div className='card-content'>
          <h3>{potion.attributes.name}</h3>
          <p>Difficulty: {potion.attributes.difficulty || 'Unknown'}</p>
          <p>{potion.attributes.effect ? potion.attributes.effect.substring(0, 100) + '...' : 'No effect description available'}</p>
        </div>
    </div>
  );
};

export default PotionCard;