import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';
import { Play, Plus } from 'lucide-react';

const MovieCard = ({ imageSrc, title, rank, id, media_type, releaseYear }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/details/${media_type || 'movie'}/${id}`);
    }
  };

  return (
    <div className="movie-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {rank && <div className="movie-rank">{rank}</div>}
      <div className="movie-image-container">
        <img src={imageSrc} alt={title} className="movie-image" />
        <div className="movie-overlay">
          <h3 className="movie-title">{title}</h3>
          {releaseYear && <p className="movie-year">{releaseYear}</p>}
          <div className="movie-actions">
            <button className="icon-btn play-btn" onClick={(e) => { e.stopPropagation(); if (id) navigate(`/watch/${media_type || 'movie'}/${id}`); }}><Play fill="black" size={16} /></button>
            <button className="icon-btn add-btn" onClick={(e) => e.stopPropagation()}><Plus size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

