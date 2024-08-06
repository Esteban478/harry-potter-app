import { useState, useEffect } from 'react';
import { fetchDailyData } from '../services/api';
import { Character, Spell, Potion } from '../types';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [dailyCharacter, setDailyCharacter] = useState<Character | null>(null);
  const [dailySpell, setDailySpell] = useState<Spell | null>(null);
  const [dailyPotion, setDailyPotion] = useState<Potion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dailyData = await fetchDailyData();
        setDailyCharacter(dailyData.character);
        setDailySpell(dailyData.spell);
        setDailyPotion(dailyData.potion);
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
      <h1>Welcome to the Harry Potter Universe</h1>
      <div className="daily-section">
        {dailyCharacter && (
          <div className="character-of-the-day">
            <h2>Character of the Day</h2>
            <img src={dailyCharacter.image} alt={dailyCharacter.name} />
            <p><strong>Name:</strong> {dailyCharacter.name}</p>
            <p><strong>House:</strong> {dailyCharacter.house}</p>
            <p><Link to="/characters">Show all characters</Link></p>
          </div>
        )}
        {dailySpell && (
          <div className="spell-of-the-day">
            <h2>Spell of the Day</h2>
            <p><strong>Name:</strong> {dailySpell.name}</p>
            <p><strong>Description:</strong> {dailySpell.description}</p>
            <p><Link to="/spellbook">Open the spellbook</Link></p>
          </div>
        )}
        {dailyPotion && (
          <div className="potion-of-the-day">
            <h2>Potion of the Day</h2>
            {dailyPotion.attributes.image && (
              <img src={dailyPotion.attributes.image} alt={dailyPotion.attributes.name} />
            )}
            <p><strong>Name:</strong> {dailyPotion.attributes.name}</p>
            <p><strong>Effect:</strong> {dailyPotion.attributes.effect}</p>
            <p><Link to="/potions">Show all potions</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;