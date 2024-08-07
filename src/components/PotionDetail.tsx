import { Potion } from '../types';
import CommentSection from './CommentSection';

interface PotionDetailProps {
  potion: Potion;
  onClose: () => void;
}

const PotionDetail: React.FC<PotionDetailProps> = ({ potion, onClose }) => {
  const ingredientList = potion.attributes.ingredients
    ? potion.attributes.ingredients.split(',').map(item => item.trim())
    : [];

  return (
    <div className="potion-detail">
      <button onClick={onClose} className="close-button">×</button>
      <img src={potion.attributes.image ? potion.attributes.image : '/placeholder-potion.jpg'} alt={potion.attributes.name} className="potion-image" />
      <h2>{potion.attributes.name || 'Unknown Potion'}</h2>
      <p><strong>Effect:</strong> {potion.attributes.effect || 'Unknown'}</p>
      <p><strong>Difficulty:</strong> {potion.attributes.difficulty || 'Unknown'}</p>
      <p><strong>Characteristics:</strong> {potion.attributes.characteristics || 'Unknown'}</p>
      <h3>Ingredients:</h3>
      {ingredientList.length > 0 ? (
        <ul>
          {ingredientList.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      ) : (
        <p>No ingredients listed</p>
      )}
      <CommentSection potionId={potion.id} />
    </div>
  );
};

export default PotionDetail;