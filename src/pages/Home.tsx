import { useState, useEffect } from 'react';
import { fetchDailyData } from '../services/api';
import { Character, Spell } from '../types';
import { useUser } from '../hooks/useUserContext';
import '../styles/Home.css';

const Home = () => {
  const [dailyCharacter, setDailyCharacter] = useState<Character | null>(null);
  const [dailySpell, setDailySpell] = useState<Spell | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile: user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dailyData = await fetchDailyData();
        setDailyCharacter(dailyData.character);
        setDailySpell(dailyData.spell);
      } catch (err) {
        setError('Failed to fetch daily data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="home">Loading...</div>;
  if (error) return <div className="home">Error: {error}</div>;

  return (
    <div className="home">
      <h1>
        Welcome to the Harry Potter World
        {user?.nickname ? ` ${user.nickname}` : ''}
      </h1>
      <div className="daily-section">
        {dailyCharacter && (
          <div className="character-of-the-day">
            <h2>Character of the Day</h2>
            <img src={dailyCharacter.image} alt={dailyCharacter.name} />
            <p><strong>Name:</strong> {dailyCharacter.name}</p>
            <p><strong>House:</strong> {dailyCharacter.house || 'Unknown'}</p>
          </div>
        )}
        {dailySpell && (
          <div className="spell-of-the-day">
            <h2>Spell of the Day</h2>
            <p><strong>Name:</strong> {dailySpell.name}</p>
            <p><strong>Description:</strong> {dailySpell.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;