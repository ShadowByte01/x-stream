import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MovieCard from '../MovieCard/MovieCard';
import './Carousel.css';

const Carousel = ({ title, movies, isNumbered, onRemove }) => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      className="carousel-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-container">
        <button className="carousel-btn left" onClick={() => scroll('left')}>
          <ChevronLeft size={32} />
        </button>
        
        <div className="carousel-slider scrollbar-hide" ref={sliderRef}>
          {movies.map((movie, index) => (
            <div key={`${movie.id}-${index}`} className={isNumbered ? 'numbered-wrapper' : 'standard-wrapper'}>
              <MovieCard
                imageSrc={movie.imageSrc}
                title={movie.title}
                rank={isNumbered ? index + 1 : null}
                id={movie.id}
                media_type={movie.media_type || 'movie'}
                releaseYear={movie.releaseYear}
                rating={movie.rating}
                progress={movie.progress}
                isMostViewed={movie.isMostViewed}
                onRemove={onRemove ? () => onRemove(movie.id, movie.media_type) : undefined}
              />
            </div>
          ))}
        </div>
        
        <button className="carousel-btn right" onClick={() => scroll('right')}>
          <ChevronRight size={32} />
        </button>
      </div>
    </motion.div>
  );
};

export default Carousel;
