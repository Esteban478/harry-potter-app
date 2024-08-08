import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import '../styles/NavigationBar.css';

const NavigationBar: React.FC = () => {
  const { userProfile } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const openDropdown = () => {
    setDropdownOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isProfilePage = location.pathname === '/profile';

  return (
    <nav className="navigation-bar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/characters">Characters</Link></li>
        <li><Link to="/potions">Potions</Link></li>
        <li><Link to="/spellbook">Spellbook</Link></li>
        {userProfile ? (
          <li className="user-menu">
            <div 
              onMouseEnter={openDropdown}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="avatar-container"
            >
              <img 
                src={userProfile.profilePicture || '/placeholder-avatar.jpg'} 
                alt={`${userProfile.nickname || 'User'}'s avatar`}
                className="nav-avatar"
              />
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <Link 
                  to="/profile" 
                  onClick={(e) => {
                    if (isProfilePage) {
                      e.preventDefault();
                    } else {
                      setDropdownOpen(false);
                    }
                  }}
                  className={isProfilePage ? 'disabled' : ''}
                >
                  Profile
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <li><Link to="/auth">Login / Register</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default NavigationBar;