import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Play, Plus, Check, Star } from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import './MovieCard.css';

const MovieCard = ({ imageSrc, title, rank, id, media_type, releaseYear, rating }) => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useUserData();

  const handleClick = () => {
    if (id) {
      navigate(`/details/${media_type || 'movie'}/${id}`);
    }
  };

  const inWishlist = isInWishlist(id, media_type || 'movie');

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (inWishlist) {
      await removeFromWishlist(id, media_type || 'movie');
    } else {
      await addToWishlist({ id, title, imageSrc, media_type: media_type || 'movie', releaseYear, rating });
    }
  };

  const ratingColor = rating >= 8 ? '#22c55e' : rating >= 6 ? '#eab308' : '#ef4444';

  return (
    <motion.div 
      className="movie-card" 
      onClick={handleClick} 
      style={{ cursor: 'pointer' }}
      whileHover={{ scale: 1.08, zIndex: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {rank && <div className="movie-rank">{rank}</div>}
      <div className="movie-image-container">
        <LazyLoadImage
          src={imageSrc}
          alt={title}
          effect="blur"
          className="movie-image"
          wrapperClassName="movie-image-wrapper"
        />
        
        {/* Rating badge */}
        {rating > 0 && !rank && (
          <div className="movie-rating-badge" style={{ borderColor: ratingColor }}>
            <Star size={10} fill={ratingColor} stroke={ratingColor} />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}

        <div className="movie-overlay">
          <h3 className="movie-title">{title}</h3>
          {releaseYear && <p className="movie-year">{releaseYear}</p>}
          <div className="movie-actions">
            <button className="icon-btn play-btn" onClick={(e) => { e.stopPropagation(); if (id) navigate(`/watch/${media_type || 'movie'}/${id}`); }}>
              <Play fill="black" size={16} />
            </button>
            <button className="icon-btn add-btn" onClick={handleWishlistClick}>
              {inWishlist ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
