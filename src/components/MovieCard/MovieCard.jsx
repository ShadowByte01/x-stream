import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Play, Plus, Check, Star } from 'lucide-react';
import { fetchVideos, getImageUrl } from '../../tmdb';
import { useActions } from '../../lib/useStore';
import MostViewedBadge from '../MostViewedBadge/MostViewedBadge';
import './MovieCard.css';

const MovieCard = ({
  imageSrc,
  title,
  rank,
  id,
  media_type,
  releaseYear,
  rating,
  progress,
  isMostViewed,
  onRemove,
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const { toggleWatchlist, isInWatchlist, isMostViewed: checkMostViewed } = useActions();
  const mt = media_type || 'movie';

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const to = setTimeout(async () => {
      if (!hovered) return;
      try {
        const vids = await fetchVideos(mt, id);
        const t = vids?.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
        if (!cancelled && t) setTrailerKey(t.key);
      } catch {
        /* ignore */
      }
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(to);
    };
  }, [hovered, id, mt]);

  useEffect(() => {
    if (!hovered) setTrailerKey(null);
  }, [hovered]);

  if (!id) return null;

  const inList = isInWatchlist(Number(id), mt);
  const mostViewed = isMostViewed !== undefined ? isMostViewed : checkMostViewed(Number(id), mt);
  const ratingColor = rating >= 8 ? '#22c55e' : rating >= 6 ? '#eab308' : '#ef4444';

  const goDetails = () => navigate(`/details/${mt}/${id}`);
  const goWatch = (e) => {
    e.stopPropagation();
    navigate(`/watch/${mt}/${id}`);
  };
  const handleList = (e) => {
    e.stopPropagation();
    toggleWatchlist({
      id: Number(id),
      media_type: mt,
      title,
      imageSrc,
      releaseYear,
      rating,
    });
  };

  return (
    <motion.div
      className="movie-card"
      onClick={goDetails}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
      whileHover={{ scale: 1.08, zIndex: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {rank && <div className="movie-rank">{rank}</div>}

      <div className="movie-image-container">
        {hovered && trailerKey ? (
          <iframe
            className="movie-trailer-preview"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${trailerKey}`}
            title={`${title} trailer`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        ) : (
          <LazyLoadImage
            src={imageSrc}
            alt={title}
            effect="blur"
            className="movie-image"
            wrapperClassName="movie-image-wrapper"
          />
        )}

        {mostViewed && !rank && <MostViewedBadge variant="corner" />}

        {/* Rating badge */}
        {rating > 0 && !rank && (
          <div className="movie-rating-badge" style={{ borderColor: ratingColor }}>
            <Star size={10} fill={ratingColor} stroke={ratingColor} />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Continue watching progress */}
        {typeof progress === 'number' && progress > 0 && (
          <div className="movie-progress">
            <div className="movie-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="movie-overlay">
          <h3 className="movie-title">{title}</h3>
          {releaseYear && <p className="movie-year">{releaseYear}</p>}
          <div className="movie-actions">
            <button className="icon-btn play-btn" onClick={goWatch} title="Play">
              <Play fill="black" size={16} />
            </button>
            <button className="icon-btn add-btn" onClick={handleList} title="My List">
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>
      </div>

      {onRemove && (
        <button
          className="movie-remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
};

export default MovieCard;
