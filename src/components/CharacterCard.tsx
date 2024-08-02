import React from 'react';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const getImageSrc = () => {
    if (character.image) return character.image;
    return character.wizard ? '/placeholder-wizard.jpg' : '/placeholder-muggle.jpg';
  };

  return (
    <div className="character-card">
      <img src={getImageSrc()} alt={character.name} />
      <h3>{character.name}</h3>
      <p>House: {character.house || 'Unknown'}</p>
      <p>Actor: {character.actor}</p>
      <p>{character.wizard ? 'Wizard' : 'Muggle'}</p>
    </div>
  );
};

export default CharacterCard;