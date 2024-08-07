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
      <div className="daily-items">
        {dailyCharacter && (
          <div className="daily-item">
            <img src={dailyCharacter.image} alt={dailyCharacter.name} />
            <div className="daily-item-content">
              <h2>Character of the Day</h2>
              <p><strong>Name:</strong> {dailyCharacter.name}</p>
              <p><strong>House:</strong> {dailyCharacter.house}</p>
              <p><strong>Patronus:</strong> {dailyCharacter.patronus ? dailyCharacter.patronus : 'unknown'}</p>
              <p><strong>Wand:</strong> {dailyCharacter.wand ? `${dailyCharacter.wand.wood} wood, ${dailyCharacter.wand.core} core, ${dailyCharacter.wand.length} inches` : 'unknown'} </p>
              <p className="category-link"><Link to="/characters">Show all characters &gt;</Link></p>
            </div>
          </div>
        )}
        {dailySpell && (
          <div className="daily-item">
            <img src="/placeholder-spell.jpg" alt="Spell of the Day" />
            <div className="daily-item-content">            
              <h2>Spell of the Day</h2>
              <p><strong>Name:</strong> {dailySpell.name}</p>
              <p><strong>Description:</strong> {dailySpell.description}</p>
              <p className="category-link"><Link to="/spellbook">Open the spellbook &gt;</Link></p>
            </div>
          </div>
        )}
        {dailyPotion && (
          <div className="daily-item">
            {dailyPotion.attributes.image && (
              <img src={dailyPotion.attributes.image} alt={dailyPotion.attributes.name} />
            )}
            <div className="daily-item-content">
              <h2>Potion of the Day</h2>
              <p><strong>Name:</strong> {dailyPotion.attributes.name}</p>
              <p><strong>Effect:</strong> {dailyPotion.attributes.effect}</p>
              <p><strong>Difficulty:</strong> {dailyPotion.attributes.difficulty ? dailyPotion.attributes.difficulty : 'unknown'}</p>
              <p><strong>Characteristics:</strong> {dailyPotion.attributes.characteristics}</p>
              <p className="category-link"><Link to="/potions">Show all potions &gt;</Link></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;