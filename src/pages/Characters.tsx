import { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { fetchCharacters } from '../services/api';
import CharacterCard from '../components/CharacterCard';
import CharacterDetail from '../components/CharacterDetail';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { Character } from '../types';
import '../styles/General.css';
import '../styles/Characters.css';
import '../styles/DetailPage.css';

const CHARACTERS_PER_PAGE = 20;

const Characters: React.FC = () => {
  const { characters, setCharacters, loading, setLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');
  const [displayedCharacters, setDisplayedCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const filteredCharacters = useMemo(() => {
    return characters.filter(
      (character) =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedHouse === '' || character.house === selectedHouse)
    );
  }, [characters, searchTerm, selectedHouse]);

  const { lastElementRef, isFetching, setIsFetching } = useInfiniteScroll(() => {});

  useEffect(() => {
    const loadMoreCharacters = () => {
      console.log('Loading more characters...');
      const startIndex = displayedCharacters.length;
      const endIndex = startIndex + CHARACTERS_PER_PAGE;
      const nextCharacters = filteredCharacters.slice(startIndex, endIndex);
      if (nextCharacters.length > 0) {
        console.log(`Adding ${nextCharacters.length} more characters`);
        setDisplayedCharacters((prev) => [...prev, ...nextCharacters]);
        setPage((prevPage) => prevPage + 1);
      } else {
        console.log('No more characters to load');
      }
      setIsFetching(false);
    };

    if (isFetching) {
      loadMoreCharacters();
    }
  }, [isFetching, setIsFetching, filteredCharacters, displayedCharacters.length]);

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCharacters = await fetchCharacters();
        setCharacters(fetchedCharacters);
        setDisplayedCharacters(fetchedCharacters.slice(0, CHARACTERS_PER_PAGE));
        setPage(2);
      } catch (error) {
        console.error('Error fetching characters:', error);
        setError('Failed to load characters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (characters.length === 0) {
      loadCharacters();
    }
  }, [characters.length, setCharacters, setLoading]);

  useEffect(() => {
    console.log('Filtered characters changed, resetting displayed characters');
    setDisplayedCharacters(filteredCharacters.slice(0, CHARACTERS_PER_PAGE));
    setPage(2);
  }, [filteredCharacters]);

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleCloseDetail = () => {
    setSelectedCharacter(null);
  };

  return (
    <div className="characters-page">
      <h1>Harry Potter Characters</h1>
      <input
        type="text"
        placeholder="Search characters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={selectedHouse}
        onChange={(e) => setSelectedHouse(e.target.value)}
      >
        <option value="">All Houses</option>
        <option value="Gryffindor">Gryffindor</option>
        <option value="Hufflepuff">Hufflepuff</option>
        <option value="Ravenclaw">Ravenclaw</option>
        <option value="Slytherin">Slytherin</option>
      </select>
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="character-grid">
          {displayedCharacters.map((character, index) => (
            <div 
              key={character.id} 
              onClick={() => handleCharacterClick(character)}
              ref={index === displayedCharacters.length - 1 ? lastElementRef : null}
            >
              <CharacterCard character={character} />
            </div>
          ))}
        </div>
      )}
      {isFetching && <LoadingSpinner />}
      {selectedCharacter && (
        <CharacterDetail character={selectedCharacter} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default Characters;