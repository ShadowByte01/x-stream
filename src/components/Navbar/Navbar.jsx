import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Settings, Bookmark } from 'lucide-react';
import { searchMulti, getImageUrl } from '../../tmdb';
import SettingsModal from '../SettingsModal/SettingsModal';
import './Navbar.css';
import './NavbarSearch.css';
import './NavbarProfile.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Keyboard "/" focuses search
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const input = document.querySelector('.search-input');
        input?.focus();
        setIsSearchActive(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const results = await searchMulti(searchQuery);
          const filtered = results
            .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
            .filter((item) => item.poster_path || item.backdrop_path)
            .slice(0, 6)
            .map((item) => ({
              id: item.id,
              media_type: item.media_type,
              title: item.title || item.name,
              releaseYear: (item.release_date || item.first_air_date || '').substring(0, 4),
              imageSrc: getImageUrl(item.poster_path, 'w92'),
            }));
          setSuggestions(filtered);
        } catch (error) {
          console.error(error);
        }
      } else {
        setSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSuggestions([]);
      setIsSearchActive(false);
    }
  };

  const handleSuggestionClick = (media_type, id) => {
    setSearchQuery('');
    setSuggestions([]);
    setIsSearchActive(false);
    navigate(`/details/${media_type}/${id}`);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'glass' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="logo-link">
              <span className="navbar-logo-text">X<span className="logo-accent">stream</span></span>
            </Link>
            <ul className="nav-links">
              <li className={location.pathname === '/' ? 'active' : ''}><Link to="/">Home</Link></li>
              <li className={location.pathname === '/series' ? 'active' : ''}><Link to="/series">Series</Link></li>
              <li className={location.pathname === '/movies' ? 'active' : ''}><Link to="/movies">Movies</Link></li>
              <li className={location.pathname === '/anime' ? 'active' : ''}><Link to="/anime">Anime</Link></li>
              <li className={location.pathname === '/new-popular' ? 'active' : ''}><Link to="/new-popular">New & Popular</Link></li>
            </ul>
          </div>

          <div className="navbar-right">
            <div className="search-container">
              <form onSubmit={handleSearchSubmit} className={`search-form ${isSearchActive ? 'active' : ''}`}>
                <Search className="nav-icon search-icon" onClick={() => setIsSearchActive(!isSearchActive)} />
                <input
                  type="text"
                  placeholder="Search titles…  (press /)"
                  className={`search-input ${isSearchActive ? 'active' : ''}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!searchQuery) setIsSearchActive(false);
                    }, 180);
                  }}
                />
              </form>
              {suggestions.length > 0 && isSearchActive && (
                <div className="search-dropdown">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="search-dropdown-item"
                      onClick={() => handleSuggestionClick(suggestion.media_type, suggestion.id)}
                    >
                      <img src={suggestion.imageSrc} alt={suggestion.title} className="suggestion-image" />
                      <div className="suggestion-info">
                        <p className="suggestion-title">{suggestion.title}</p>
                        <p className="suggestion-year">{suggestion.releaseYear} • {suggestion.media_type === 'movie' ? 'Movie' : 'TV Series'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Bookmark className="nav-icon" title="My List" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} />
            <Settings className="nav-icon settings-icon" onClick={() => setShowSettings(true)} style={{ cursor: 'pointer' }} />
            <div className="nav-profile">
              <button className="nav-signin-btn" onClick={() => navigate('/profile')} title="My Xstream">
                <User size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default Navbar;
