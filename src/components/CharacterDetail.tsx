import { Character } from '../types';

interface CharacterDetailProps {
  character: Character;
  onClose: () => void;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character, onClose }) => {
  const getImageSrc = () => {
    if (character.image) return character.image;
    return character.wizard ? '/placeholder-wizard.png' : '/placeholder-muggle.png';
  };

  return (
    <div className="character-detail">
      <button onClick={onClose} className="close-button">×</button>
      <img src={getImageSrc()} alt={character.name} className="character-image" />
      <h2>{character.name}</h2>
      <p><strong>House:</strong> {character.house || 'Unknown'}</p>
      <p><strong>Actor:</strong> {character.actor}</p>
      <p><strong>Type:</strong> {character.wizard ? 'Wizard' : 'Muggle'}</p>
      <p><strong>Ancestry:</strong> {character.ancestry || 'Unknown'}</p>
      <p><strong>Date of Birth:</strong> {character.dateOfBirth || 'Unknown'}</p>
      <p><strong>Patronus:</strong> {character.patronus || 'Unknown'}</p>
      <p><strong>Wand:</strong> {character.wand?.wood ? `${character.wand.wood} wood, ${character.wand.core} core, ${character.wand.length} inches` : 'Unknown'}</p>
    </div>
  );
};

export default CharacterDetail;