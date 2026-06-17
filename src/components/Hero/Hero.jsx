import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import './Hero.css';

const Hero = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const currentMovie = movies[currentIndex];

  const handleMoreInfo = () => {
    if (currentMovie && currentMovie.id) {
      navigate(`/details/${currentMovie.media_type || 'movie'}/${currentMovie.id}`);
    }
  };

  return (
    <div className="hero-container">
      {movies.map((movie, index) => (
        <div 
          key={movie.id || index} 
          className={`hero-background ${index === currentIndex ? 'active' : ''}`}
        >
          <img src={movie.backdropSrc || movie.imageSrc} alt={movie.title} className="hero-image" />
          <div className="hero-vignette"></div>
        </div>
      ))}
      
      <div className="hero-content">
        <h1 className="hero-title glow-text">{currentMovie.title}</h1>
        <p className="hero-description">{currentMovie.description}</p>
        
        <div className="hero-buttons">
          <button className="glow-button" onClick={() => {
            if (currentMovie && currentMovie.id) {
              navigate(`/watch/${currentMovie.media_type || 'movie'}/${currentMovie.id}`);
            }
          }}>
            <Play fill="black" size={20} />
            <span>Play</span>
          </button>
          <button className="glow-button secondary" onClick={handleMoreInfo}>
            <Info size={20} />
            <span>More Info</span>
          </button>
        </div>
      </div>

      <button className="hero-nav-btn left" onClick={handlePrevious}>
        <ChevronLeft size={48} />
      </button>
      
      <button className="hero-nav-btn right" onClick={handleNext}>
        <ChevronRight size={48} />
      </button>

      <div className="hero-indicators">
        {movies.map((_, index) => (
          <div 
            key={index} 
            className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
