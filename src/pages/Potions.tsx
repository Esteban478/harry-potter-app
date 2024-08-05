import { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { fetchPotions } from '../services/api';
import PotionCard from '../components/PotionCard';
import PotionDetail from '../components/PotionDetail';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { Potion } from '../types';
import '../styles/General.css';
import '../styles/Potions.css';
import '../styles/DetailPage.css';

const POTIONS_PER_PAGE = 20;

const Potions: React.FC = () => {
  const { potions, setPotions, loading, setLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedPotions, setDisplayedPotions] = useState<Potion[]>([]);
  const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null);
  const [, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const filteredPotions = useMemo(() => {
    return potions.filter((potion) =>
      potion.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [potions, searchTerm]);

  const { lastElementRef, isFetching, setIsFetching } = useInfiniteScroll(() => {});

  useEffect(() => {
    const loadMorePotions = () => {
      console.log('Loading more potions...');
      const startIndex = displayedPotions.length;
      const endIndex = startIndex + POTIONS_PER_PAGE;
      const nextPotions = filteredPotions.slice(startIndex, endIndex);
      if (nextPotions.length > 0) {
        console.log(`Adding ${nextPotions.length} more potions`);
        setDisplayedPotions((prev) => [...prev, ...nextPotions]);
        setPage((prevPage) => prevPage + 1);
      } else {
        console.log('No more potions to load');
      }
      setIsFetching(false);
    };

    if (isFetching) {
      loadMorePotions();
    }
  }, [isFetching, setIsFetching, filteredPotions, displayedPotions.length]);

  useEffect(() => {
    const loadPotions = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPotions = await fetchPotions();
        setPotions(fetchedPotions);
        setDisplayedPotions(fetchedPotions.slice(0, POTIONS_PER_PAGE));
        setPage(2);
      } catch (error) {
        console.error('Error fetching potions:', error);
        setError('Failed to load potions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (potions.length === 0) {
      loadPotions();
    }
  }, [potions.length, setPotions, setLoading]);

  useEffect(() => {
    console.log('Filtered potions changed, resetting displayed potions');
    setDisplayedPotions(filteredPotions.slice(0, POTIONS_PER_PAGE));
    setPage(2);
  }, [filteredPotions]);

  const handlePotionClick = (potion: Potion) => {
    setSelectedPotion(potion);
  };

  const handleCloseDetail = () => {
    setSelectedPotion(null);
  };

  return (
    <div className="potions-page">
      <h1>Harry Potter Potions</h1>
      <input
        type="text"
        placeholder="Search potions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="potions-grid">
          {displayedPotions.map((potion, index) => (
            <div 
              key={potion.id} 
              onClick={() => handlePotionClick(potion)}
              ref={index === displayedPotions.length - 1 ? lastElementRef : null}
            >
              <PotionCard potion={potion} />
            </div>
          ))}
        </div>
      )}
      {isFetching && <LoadingSpinner />}
      {selectedPotion && (
        <PotionDetail potion={selectedPotion} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default Potions;