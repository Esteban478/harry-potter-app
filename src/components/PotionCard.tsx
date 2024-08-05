import { Potion } from '../types';

interface PotionCardProps {
  potion: Potion;
  onClick: () => void;
}

const PotionCard: React.FC<PotionCardProps> = ({ potion, onClick }) => {
    const getImageSrc = () => {
        return potion.attributes.image ? potion.attributes.image : '/placeholder-potion.jpg';
    };
  return (
        <div className="potion-card" onClick={onClick}>
        <img src={getImageSrc()} alt={potion.attributes.name} />
        <h3>{potion.attributes.name}</h3>
        <p>Difficulty: {potion.attributes.difficulty || 'Unknown'}</p>
        <p>{potion.attributes.effect ? potion.attributes.effect.substring(0, 100) + '...' : 'No effect description available'}</p>
    </div>
  );
};

export default PotionCard;