import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDetails, fetchCredits, fetchWatchProviders, fetchSimilar, fetchVideos, fetchKeywords, getImageUrl } from '../tmdb';
import { Play, ArrowLeft, User, Star, Clock, Calendar, Globe, Film, Tv, ExternalLink, Plus, Check, Heart, Share2, Volume2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useActions } from '../lib/useStore';
import MostViewedBadge from '../components/MostViewedBadge/MostViewedBadge';
import './Details.css';

const StarRating = ({ rating, onRate }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          className={`star-btn ${v <= (hover || rating) ? 'filled' : ''}`}
          onClick={() => onRate(v)}
          onMouseEnter={() => setHover(v)}
          onMouseLeave={() => setHover(0)}
        >
          <Star size={20} />
        </button>
      ))}
    </div>
  );
};

const Details = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [providers, setProviders] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [videos, setVideos] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingTrailer, setPlayingTrailer] = useState(null);

  const {
    toggleWatchlist,
    isInWatchlist,
    toggleLike,
    isLiked,
    setRating: setUserRating,
    getRating: getUserRating,
    isMostViewed,
  } = useActions();

  const mediaId = Number(id);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const [detailsData, creditsData, providersData, similarData, videosData, keywordsData] = await Promise.all([
          fetchDetails(type, id),
          fetchCredits(type, id),
          fetchWatchProviders(type, id),
          fetchSimilar(type, id).catch(() => []),
          fetchVideos(type, id).catch(() => []),
          fetchKeywords(type, id).catch(() => []),
        ]);
        setDetails(detailsData);
        setCredits(creditsData);
        setProviders(providersData?.US || providersData?.IN || null);
        setSimilar(similarData?.slice(0, 8) || []);
        setVideos(videosData?.filter((v) => v.site === 'YouTube') || []);
        setKeywords(keywordsData || []);
      } catch (error) {
        console.error('Failed to fetch details', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
    window.scrollTo(0, 0);
  }, [type, id]);

  if (loading) return <div className="details-loading"><div className="loading-spinner" /></div>;
  if (!details) return <div className="details-error">Content not found.</div>;

  const backdropUrl = getImageUrl(details.backdrop_path, 'original');
  const posterUrl = getImageUrl(details.poster_path, 'w500');
  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date || '';
  const releaseYear = releaseDate.substring(0, 4);
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : '';
  const seasons = details.number_of_seasons;
  const episodes = details.number_of_episodes;

  const directors = credits?.crew?.filter((c) => c.job === 'Director') || [];
  const writers = credits?.crew?.filter((c) => c.job === 'Screenplay' || c.job === 'Writer' || c.department === 'Writing')?.slice(0, 3) || [];
  const topCast = credits?.cast?.slice(0, 12) || [];

  const rating = details.vote_average || 0;
  const ratingPercent = Math.round(rating * 10);
  const voteCount = details.vote_count || 0;
  const trailer = videos.find((v) => v.type === 'Trailer') || videos[0];

  const formatCurrency = (num) => (num && num !== 0 ? `$${num.toLocaleString('en-US')}` : null);
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  const inWishlist = isInWatchlist(mediaId, type);
  const liked = isLiked(mediaId, type);
  const userRating = getUserRating(mediaId, type);
  const mv = isMostViewed(mediaId, type);

  const handleWishlist = () =>
    toggleWatchlist({ id: mediaId, media_type: type, title, imageSrc: posterUrl, releaseYear, rating });
  const handleLike = () =>
    toggleLike({ id: mediaId, media_type: type, title, poster_path: details.poster_path, backdrop_path: details.backdrop_path });
  const handleRate = (v) => setUserRating(mediaId, type, v);

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div className="details-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <div className="details-hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="details-vignette" />
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <div className="details-hero-content">
          <div className="details-hero-layout">
            {posterUrl && (
              <div className="details-poster-wrap">
                <img src={posterUrl} alt={title} className="details-poster" />
                {mv && <MostViewedBadge variant="ribbon" />}
              </div>
            )}
            <div className="details-hero-info">
              {details.tagline && <p className="details-tagline">"{details.tagline}"</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 className="details-title">{title}</h1>
                {mv && <MostViewedBadge variant="pill" />}
              </div>
              <div className="details-meta">
                {releaseYear && <span className="meta-chip"><Calendar size={14} /> {releaseYear}</span>}
                {runtime && <span className="meta-chip"><Clock size={14} /> {runtime}</span>}
                {type === 'tv' && seasons && <span className="meta-chip"><Tv size={14} /> {seasons} Season{seasons > 1 ? 's' : ''}</span>}
                {type === 'tv' && episodes && <span className="meta-chip"><Film size={14} /> {episodes} Ep</span>}
                {details.original_language && <span className="meta-chip"><Globe size={14} /> {details.original_language.toUpperCase()}</span>}
              </div>

              {/* Rating Ring */}
              <div className="rating-section">
                <div className="rating-ring" style={{ '--rating-percent': ratingPercent }}>
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${ratingPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="rating-number">{rating.toFixed(1)}</span>
                </div>
                <div className="rating-label">
                  <span className="rating-title">User Score</span>
                  <span className="rating-votes">{voteCount.toLocaleString()} votes</span>
                </div>
              </div>

              {/* Your Rating */}
              <div className="your-rating-section">
                <span className="your-rating-label">Your Rating</span>
                <StarRating rating={userRating} onRate={handleRate} />
              </div>

              <div className="genre-tags">
                {details.genres?.map((g) => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
              <p className="details-overview">{details.overview}</p>

              <div className="details-actions">
                <button className="glow-button" onClick={() => navigate(`/watch/${type}/${id}`)}>
                  <Play fill="black" size={20} />
                  <span>Play</span>
                </button>
                {trailer && (
                  <button className="glow-button secondary" onClick={() => setPlayingTrailer(trailer)}>
                    <Play fill="white" size={18} />
                    <span>Trailer</span>
                  </button>
                )}
                <button className={`glow-button secondary list-btn ${inWishlist ? 'in-list' : ''}`} onClick={handleWishlist}>
                  {inWishlist ? <Check size={18} /> : <Plus size={18} />}
                  <span>My List</span>
                </button>
                <button className={`glow-button secondary like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                  <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                  <span>Like</span>
                </button>
                <button className="glow-button secondary" onClick={handleShare}>
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="details-content-body">
        {/* Trailers & Videos */}
        {videos.length > 0 && (
          <div className="details-section">
            <h2 className="section-title">Trailers & Videos</h2>
            <div className="trailer-section">
              {/* Inline Player */}
              {playingTrailer && (
                <div className="trailer-player-container" onClick={(e) => e.stopPropagation()}>
                  <div className="trailer-player-header">
                    <span className="trailer-player-title">
                      <Volume2 size={14} /> {playingTrailer.name}
                    </span>
                    <button className="trailer-close-btn" onClick={() => setPlayingTrailer(null)}>
                      <X size={18} />
                    </button>
                  </div>
                  <div className="trailer-player-iframe-wrap">
                    <iframe
                      src={`https://www.youtube.com/embed/${playingTrailer.key}?autoplay=1&rel=0`}
                      title={playingTrailer.name}
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                      className="trailer-iframe"
                    />
                  </div>
                </div>
              )}
              {/* Video Thumbnails */}
              <div className="trailer-grid">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className={`trailer-thumb ${playingTrailer?.key === video.key ? 'active' : ''}`}
                    onClick={() => setPlayingTrailer(video)}
                  >
                    <div className="trailer-thumb-img">
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                        alt={video.name}
                        loading="lazy"
                      />
                      <div className="trailer-thumb-overlay">
                        <div className="trailer-play-btn">
                          <Play fill="white" size={20} />
                        </div>
                      </div>
                      {video.type === 'Trailer' && <span className="trailer-type-badge">Trailer</span>}
                      {video.official && <span className="trailer-official-badge">Official</span>}
                    </div>
                    <div className="trailer-thumb-info">
                      <p className="trailer-thumb-name">{video.name}</p>
                      <span className="trailer-thumb-meta">{video.type} · {video.published_at?.substring(0, 4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cast */}
        <div className="details-section">
          <h2 className="section-title">Top Cast</h2>
          <div className="cast-grid">
            {topCast.map((actor) => (
              <div key={actor.id} className="cast-card" onClick={() => navigate(`/person/${actor.id}`)} style={{ cursor: 'pointer' }}>
                {actor.profile_path ? (
                  <img src={getImageUrl(actor.profile_path, 'w185')} alt={actor.name} className="cast-image" />
                ) : (
                  <div className="cast-placeholder"><User size={30} /></div>
                )}
                <p className="cast-name">{actor.name}</p>
                <p className="cast-character">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Grid */}
        <div className="details-section">
          <h2 className="section-title">Details</h2>
          <div className="info-grid">
            {directors.length > 0 && (
              <div className="info-card"><h4>Director{directors.length > 1 ? 's' : ''}</h4><p>{directors.map((d) => d.name).join(', ')}</p></div>
            )}
            {writers.length > 0 && (
              <div className="info-card"><h4>Writers</h4><p>{writers.map((w) => w.name).join(', ')}</p></div>
            )}
            {details.status && <div className="info-card"><h4>Status</h4><p>{details.status}</p></div>}
            {releaseDate && <div className="info-card"><h4>Release Date</h4><p>{formatDate(releaseDate)}</p></div>}
            {details.runtime && <div className="info-card"><h4>Runtime</h4><p>{details.runtime} minutes</p></div>}
            {formatCurrency(details.budget) && <div className="info-card"><h4>Budget</h4><p>{formatCurrency(details.budget)}</p></div>}
            {formatCurrency(details.revenue) && <div className="info-card"><h4>Revenue</h4><p>{formatCurrency(details.revenue)}</p></div>}
            {details.spoken_languages?.length > 0 && (
              <div className="info-card"><h4>Languages</h4><p>{details.spoken_languages.map((l) => l.english_name).join(', ')}</p></div>
            )}
            {details.original_title && details.original_title !== title && (
              <div className="info-card"><h4>Original Title</h4><p>{details.original_title}</p></div>
            )}
            {type === 'tv' && details.created_by?.length > 0 && (
              <div className="info-card"><h4>Created By</h4><p>{details.created_by.map((c) => c.name).join(', ')}</p></div>
            )}
            {type === 'tv' && details.networks?.length > 0 && (
              <div className="info-card"><h4>Networks</h4>
                <div className="networks-list">
                  {details.networks.map((n) =>
                    n.logo_path ? <img key={n.id} src={getImageUrl(n.logo_path, 'w92')} alt={n.name} title={n.name} className="network-logo" /> : <span key={n.id} className="network-name">{n.name}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Production */}
        {details.production_companies?.length > 0 && (
          <div className="details-section">
            <h2 className="section-title">Production</h2>
            <div className="production-grid">
              {details.production_companies.map((company) => (
                <div key={company.id} className="production-card" onClick={() => navigate(`/company/${company.id}`)} style={{ cursor: 'pointer' }}>
                  {company.logo_path ? (
                    <img src={getImageUrl(company.logo_path, 'w154')} alt={company.name} className="production-logo" />
                  ) : (
                    <span className="production-name-only">{company.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Where to Watch */}
        {providers && (providers.flatrate || providers.buy || providers.rent) && (
          <div className="details-section">
            <h2 className="section-title">Where to Watch</h2>
            <div className="providers-grid">
              {providers.flatrate?.length > 0 && (
                <div className="provider-group"><h4>Stream</h4>
                  <div className="providers-list">{providers.flatrate.map((p) => <img key={p.provider_id} src={getImageUrl(p.logo_path, 'w92')} alt={p.provider_name} title={p.provider_name} className="provider-logo" />)}</div>
                </div>
              )}
              {providers.rent?.length > 0 && (
                <div className="provider-group"><h4>Rent</h4>
                  <div className="providers-list">{providers.rent.slice(0, 5).map((p) => <img key={p.provider_id} src={getImageUrl(p.logo_path, 'w92')} alt={p.provider_name} title={p.provider_name} className="provider-logo" />)}</div>
                </div>
              )}
              {providers.buy?.length > 0 && (
                <div className="provider-group"><h4>Buy</h4>
                  <div className="providers-list">{providers.buy.slice(0, 5).map((p) => <img key={p.provider_id} src={getImageUrl(p.logo_path, 'w92')} alt={p.provider_name} title={p.provider_name} className="provider-logo" />)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="details-section">
            <h2 className="section-title">Keywords</h2>
            <div className="keyword-tags">{keywords.slice(0, 15).map((kw) => <span key={kw.id} className="keyword-tag">{kw.name}</span>)}</div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="details-section">
            <h2 className="section-title">More Like This</h2>
            <div className="similar-grid">
              {similar.filter((s) => s.poster_path).map((item) => (
                <div key={item.id} className="similar-card" onClick={() => navigate(`/details/${type}/${item.id}`)}>
                  <img src={getImageUrl(item.poster_path, 'w342')} alt={item.title || item.name} className="similar-poster" />
                  <div className="similar-info">
                    <p className="similar-title">{item.title || item.name}</p>
                    <p className="similar-year">{(item.release_date || item.first_air_date || '').substring(0, 4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Details;
