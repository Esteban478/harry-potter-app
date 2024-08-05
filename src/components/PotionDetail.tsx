import { Potion } from '../types';

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
      {potion.attributes.image && (
        <img src={potion.attributes.image} alt={potion.attributes.name} className="potion-image" />
      )}
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
    </div>
  );
};

export default PotionDetail;