import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/NavigationBar.css';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

const NavigationBar: React.FC = () => {
  const { userProfile } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const openDropdown = () => {
    setDropdownOpen(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isProfilePage = location.pathname === '/profile';

  const navLinks = (
    <>
      <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
      <li><Link to="/characters" onClick={() => setMobileMenuOpen(false)}>Characters</Link></li>
      <li><Link to="/potions" onClick={() => setMobileMenuOpen(false)}>Potions</Link></li>
      <li><Link to="/spellbook" onClick={() => setMobileMenuOpen(false)}>Spellbook</Link></li>
      {!userProfile ? <li><Link to="/auth" className="login-link">Login / Register</Link></li> : null }
    </>
  );

  return (
    <nav className="navigation-bar">
      <div className="mobile-nav">
        <button className="hamburger-menu" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        {userProfile ? (
          <div className="user-menu">
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
          </div>
        ) : (
          <Link to="/auth" className="login-link">Login / Register</Link>
        )}
      </div>
      <ul className="desktop-nav">
        {navLinks}
        {userProfile && 
          <div className="user-menu">
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
          </div>
        }
      </ul>
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" ref={mobileMenuRef}>
        <FontAwesomeIcon
          className="close-button"
          onClick={toggleMobileMenu}
          icon={faTimes}
        />
          <ul className="mobile-menu">
            {navLinks}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;