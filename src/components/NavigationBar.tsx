import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import '../styles/NavigationBar.css';

const NavigationBar = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navigation-bar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/characters">Characters</Link></li>
        <li><Link to="/spellbook">Spellbook</Link></li>
        {currentUser ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/auth">Login / Register</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default NavigationBar;