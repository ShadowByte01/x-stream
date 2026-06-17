import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastAverageColor } from 'fast-average-color';
import './Hero.css';

const fac = new FastAverageColor();

const Hero = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgColor, setBgColor] = useState('rgba(20,20,20,1)');
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
      }, 6000);
    };
    
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [movies]);

  // Dynamic color extraction
  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const currentMovie = movies[currentIndex];
    if (!currentMovie?.backdropSrc) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = currentMovie.backdropSrc;
    img.onload = () => {
      fac.getColorAsync(img)
        .then(color => setBgColor(color.rgba))
        .catch(() => {});
    };
  }, [currentIndex, movies]);

  if (!movies || movies.length === 0) return null;

  const handleSelect = (index) => {
    clearInterval(timerRef.current);
    setCurrentIndex(index);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
  };

  const currentMovie = movies[currentIndex];

  return (
    <div className="hero-container">
      {/* Dynamic color radial gradient overlay */}
      <div 
        className="hero-color-overlay"
        style={{ background: `radial-gradient(ellipse at 70% 30%, ${bgColor} 0%, transparent 60%)` }}
      />

      {/* Background images with cross-fade */}
      {movies.map((movie, index) => (
        <div 
          key={movie.id || index} 
          className={`hero-background ${index === currentIndex ? 'active' : ''}`}
        >
          <img src={movie.backdropSrc || movie.imageSrc} alt={movie.title} className="hero-image" />
          <div className="hero-vignette"></div>
        </div>
      ))}
      
      {/* Animated content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: -40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hero-content"
        >
          {/* Content type badge */}
          <div className="hero-badge">
            <div className="hero-badge-icon">X</div>
            <span className="hero-badge-text">FILM</span>
          </div>

          <h1 className="hero-title glow-text">{currentMovie.title}</h1>
          
          {/* Meta info chips */}
          <div className="hero-meta-chips">
            {currentMovie.rating && (
              <span className="hero-chip">
                <Star size={14} fill="var(--accent-color)" stroke="var(--accent-color)" />
                {currentMovie.rating}
              </span>
            )}
            {currentMovie.releaseYear && (
              <span className="hero-chip">{currentMovie.releaseYear}</span>
            )}
          </div>

          <p className="hero-description">{currentMovie.description}</p>
          
          <div className="hero-buttons">
            <motion.button 
              className="glow-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (currentMovie?.id) {
                  navigate(`/watch/${currentMovie.media_type || 'movie'}/${currentMovie.id}`);
                }
              }}
            >
              <Play fill="black" size={20} />
              <span>Play</span>
            </motion.button>
            <motion.button 
              className="glow-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (currentMovie?.id) {
                  navigate(`/details/${currentMovie.media_type || 'movie'}/${currentMovie.id}`);
                }
              }}
            >
              <Info size={20} />
              <span>More Info</span>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Thumbnail strip (bottom-right, desktop only) */}
      <div className="hero-thumbnails">
        {movies.map((m, i) => (
          <motion.div
            key={m.id || i}
            className={`hero-thumb ${i === currentIndex ? 'active' : ''}`}
            onClick={() => handleSelect(i)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img src={m.backdropSrc || m.imageSrc} alt={m.title} />
          </motion.div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="hero-indicators">
        {movies.map((_, index) => (
          <div 
            key={index} 
            className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleSelect(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
