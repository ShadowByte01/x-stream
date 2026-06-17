import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDetails, fetchCredits, fetchWatchProviders, fetchSimilar, fetchVideos, fetchKeywords, getImageUrl } from '../tmdb';
import { Play, ArrowLeft, User, Star, Clock, Calendar, Globe, DollarSign, Film, Tv, ExternalLink, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserData } from '../hooks/useUserData';
import './Details.css';

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
  const { isInWishlist, addToWishlist, removeFromWishlist } = useUserData();

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
        setVideos(videosData?.filter(v => v.site === 'YouTube') || []);
        setKeywords(keywordsData || []);
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
    window.scrollTo(0, 0);
  }, [type, id]);

  if (loading) return <div className="details-loading"><div className="loading-spinner"></div></div>;
  if (!details) return <div className="details-error">Content not found.</div>;

  const backdropUrl = getImageUrl(details.backdrop_path, 'original');
  const posterUrl = getImageUrl(details.poster_path, 'w500');
  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date || '';
  const releaseYear = releaseDate.substring(0, 4);
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : '';
  const seasons = details.number_of_seasons;
  const episodes = details.number_of_episodes;

  const directors = credits?.crew?.filter(c => c.job === 'Director') || [];
  const writers = credits?.crew?.filter(c => c.job === 'Screenplay' || c.job === 'Writer' || c.department === 'Writing')?.slice(0, 3) || [];
  const producers = credits?.crew?.filter(c => c.job === 'Producer' || c.job === 'Executive Producer')?.slice(0, 3) || [];
  const topCast = credits?.cast?.slice(0, 12) || [];
  
  const rating = details.vote_average || 0;
  const ratingPercent = Math.round(rating * 10);
  const voteCount = details.vote_count || 0;
  const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
  
  const formatCurrency = (num) => {
    if (!num || num === 0) return null;
    return '$' + num.toLocaleString('en-US');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const inWishlist = isInWishlist(Number(id), type);

  const handleWishlistClick = async () => {
    if (inWishlist) {
      await removeFromWishlist(Number(id), type);
    } else {
      await addToWishlist({ 
        id: Number(id), 
        title, 
        imageSrc: posterUrl, 
        media_type: type, 
        releaseYear, 
        rating 
      });
    }
  };

  return (
    <motion.div className="details-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <div className="details-hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="details-vignette"></div>
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>

        <div className="details-hero-content">
          <div className="details-hero-layout">
            {/* Poster */}
            {posterUrl && (
              <div className="details-poster-wrap">
                <img src={posterUrl} alt={title} className="details-poster" />
              </div>
            )}

            {/* Info */}
            <div className="details-hero-info">
              {details.tagline && <p className="details-tagline">"{details.tagline}"</p>}
              <h1 className="details-title">{title}</h1>

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

              {/* Genres */}
              <div className="genre-tags">
                {details.genres?.map(g => (
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
                  <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer" className="glow-button secondary">
                    <Play fill="white" size={18} />
                    <span>Trailer</span>
                  </a>
                )}
                <button className="glow-button secondary" onClick={handleWishlistClick} style={{ padding: '10px 16px' }}>
                  {inWishlist ? <Check size={18} /> : <Plus size={18} />}
                  <span>{inWishlist ? 'My List' : 'My List'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="details-content-body">

        {/* Cast Section */}
        <div className="details-section">
          <h2 className="section-title">Top Cast</h2>
          <div className="cast-grid">
            {topCast.map(actor => (
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

        {/* Info Grid Section */}
        <div className="details-section">
          <h2 className="section-title">Details</h2>
          <div className="info-grid">
            {/* Crew */}
            {directors.length > 0 && (
              <div className="info-card">
                <h4>Director{directors.length > 1 ? 's' : ''}</h4>
                <p>{directors.map(d => d.name).join(', ')}</p>
              </div>
            )}
            {writers.length > 0 && (
              <div className="info-card">
                <h4>Writers</h4>
                <p>{writers.map(w => w.name).join(', ')}</p>
              </div>
            )}
            {producers.length > 0 && (
              <div className="info-card">
                <h4>Producers</h4>
                <p>{producers.map(p => p.name).join(', ')}</p>
              </div>
            )}

            {/* Status */}
            {details.status && (
              <div className="info-card">
                <h4>Status</h4>
                <p>{details.status}</p>
              </div>
            )}

            {/* Full Release Date */}
            {releaseDate && (
              <div className="info-card">
                <h4>Release Date</h4>
                <p>{formatDate(releaseDate)}</p>
              </div>
            )}

            {/* Runtime */}
            {details.runtime && (
              <div className="info-card">
                <h4>Runtime</h4>
                <p>{details.runtime} minutes</p>
              </div>
            )}

            {/* Budget */}
            {formatCurrency(details.budget) && (
              <div className="info-card">
                <h4>Budget</h4>
                <p>{formatCurrency(details.budget)}</p>
              </div>
            )}

            {/* Revenue */}
            {formatCurrency(details.revenue) && (
              <div className="info-card">
                <h4>Revenue</h4>
                <p>{formatCurrency(details.revenue)}</p>
              </div>
            )}

            {/* Spoken Languages */}
            {details.spoken_languages?.length > 0 && (
              <div className="info-card">
                <h4>Languages</h4>
                <p>{details.spoken_languages.map(l => l.english_name).join(', ')}</p>
              </div>
            )}

            {/* Original Title */}
            {details.original_title && details.original_title !== title && (
              <div className="info-card">
                <h4>Original Title</h4>
                <p>{details.original_title}</p>
              </div>
            )}

            {/* TV-specific */}
            {type === 'tv' && details.created_by?.length > 0 && (
              <div className="info-card">
                <h4>Created By</h4>
                <p>{details.created_by.map(c => c.name).join(', ')}</p>
              </div>
            )}
            {type === 'tv' && details.networks?.length > 0 && (
              <div className="info-card">
                <h4>Networks</h4>
                <div className="networks-list">
                  {details.networks.map(n => (
                    n.logo_path ? (
                      <img key={n.id} src={getImageUrl(n.logo_path, 'w92')} alt={n.name} title={n.name} className="network-logo" />
                    ) : (
                      <span key={n.id} className="network-name">{n.name}</span>
                    )
                  ))}
                </div>
              </div>
            )}
            {type === 'tv' && details.episode_run_time?.length > 0 && (
              <div className="info-card">
                <h4>Episode Runtime</h4>
                <p>{details.episode_run_time[0]} min/ep</p>
              </div>
            )}
          </div>
        </div>

        {/* Production Companies */}
        {details.production_companies?.length > 0 && (
          <div className="details-section">
            <h2 className="section-title">Production</h2>
            <div className="production-grid">
              {details.production_companies.map(company => (
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
                <div className="provider-group">
                  <h4>Stream</h4>
                  <div className="providers-list">
                    {providers.flatrate.map(p => (
                      <img key={p.provider_id} src={getImageUrl(p.logo_path, 'w92')} alt={p.provider_name} title={p.provider_name} className="provider-logo" />
                    ))}
                  </div>
                </div>
              )}
              {providers.rent?.length > 0 && (
                <div className="provider-group">
                  <h4>Rent</h4>
                  <div className="providers-list">
                    {providers.rent.slice(0, 5).map(p => (
                      <img key={p.provider_id} src={getImageUrl(p.logo_path, 'w92')} alt={p.provider_name} title={p.provider_name} className="provider-logo" />
                    ))}
                  </div>
                </div>
              )}
              {providers.buy?.length > 0 && (
                <div className="provider-group">
                  <h4>Buy</h4>
                  <div className="providers-list">
                    {providers.buy.slice(0, 5).map(p => (
                      <img key={p.provider_id} src={getImageUrl(p.logo_path, 'w92')} alt={p.provider_name} title={p.provider_name} className="provider-logo" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="details-section">
            <h2 className="section-title">Keywords</h2>
            <div className="keyword-tags">
              {keywords.slice(0, 15).map(kw => (
                <span key={kw.id} className="keyword-tag">{kw.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Similar Titles */}
        {similar.length > 0 && (
          <div className="details-section">
            <h2 className="section-title">More Like This</h2>
            <div className="similar-grid">
              {similar.filter(s => s.poster_path).map(item => (
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
