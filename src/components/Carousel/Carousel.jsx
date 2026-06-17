import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '../MovieCard/MovieCard';
import './Carousel.css';

const Carousel = ({ title, movies, isNumbered }) => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-container">
        <button className="carousel-btn left" onClick={() => scroll('left')}>
          <ChevronLeft size={32} />
        </button>
        
        <div className="carousel-slider" ref={sliderRef}>
          {movies.map((movie, index) => (
            <div key={index} className={isNumbered ? 'numbered-wrapper' : 'standard-wrapper'}>
              <MovieCard 
                imageSrc={movie.imageSrc} 
                title={movie.title} 
                rank={isNumbered ? index + 1 : null}
                id={movie.id}
                media_type={movie.media_type || 'movie'}
                releaseYear={movie.releaseYear}
              />
            </div>
          ))}
        </div>
        
        <button className="carousel-btn right" onClick={() => scroll('right')}>
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
