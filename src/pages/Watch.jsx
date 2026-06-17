import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchDetails, fetchExternalIds, fetchSimilar } from '../tmdb';
import { ArrowLeft, Maximize2, Minimize2, Tv, Film, AlertTriangle, ChevronDown, CheckCircle2, XCircle, Loader2, Download, Zap, Star, MapPin, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { supabase } from '../supabaseClient';
import { getImageUrl } from '../tmdb';
import MovieCard from '../components/MovieCard/MovieCard';
import './Watch.css';

// 5 genuinely DIFFERENT embed providers — strict providers that do NOT play random movies if not found
const BACKENDS = [
  // 0: VidLink (Extremely strict, no random movies, clean player)
  { urlFuncMovie: (id) => `https://vidlink.pro/movie/${id}`, urlFuncTv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`, checkUrl: 'https://vidlink.pro' },
  // 1: VidSrc.me (Official VidSrc, strict Not Found pages)
  { urlFuncMovie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`, urlFuncTv: (id, s, e) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`, checkUrl: 'https://vidsrc.me' },
  // 2: VidSrc PRO (High quality)
  { urlFuncMovie: (id) => `https://vidsrc.pro/embed/movie/${id}`, urlFuncTv: (id, s, e) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`, checkUrl: 'https://vidsrc.pro' },
  // 3: VidSrc.cc (Alternative)
  { urlFuncMovie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`, urlFuncTv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`, checkUrl: 'https://vidsrc.cc' },
  // 4: SuperEmbed (fallback)
  { urlFuncMovie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, urlFuncTv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`, checkUrl: 'https://multiembed.mov' },
];

// Server display names mapped to backend indices
const SERVER_CONFIGS = [
  // --- Xstream branded ---
  { name: 'Xstream', flag: <Zap size={14} />, backendIdx: 0 },
  { name: 'Xstream Pro', flag: <Zap size={14} />, backendIdx: 1 },
  { name: 'Xstream Premium', flag: <Star size={14} fill="currentColor" />, backendIdx: 2 },
  { name: 'Xstream Ultra', flag: <Zap size={14} />, backendIdx: 3 },
  { name: 'Xstream Max', flag: <Zap size={14} />, backendIdx: 4 },
  
  // --- Additional Servers ---
  { name: 'Turbo', flag: <><MapPin size={12}/> US</>, backendIdx: 0 },
  { name: 'NHD', flag: <><MapPin size={12}/> IN</>, backendIdx: 1 },
  { name: '4K', flag: <><MapPin size={12}/> UK</>, backendIdx: 2 },
  { name: 'Premium', flag: <><MapPin size={12}/> US</>, backendIdx: 3 },
  { name: 'MultiEmbed', flag: <><MapPin size={12}/> AU</>, backendIdx: 4 },
  { name: 'Atlas', flag: <><MapPin size={12}/> US</>, backendIdx: 0 },
  { name: 'Vidsrc', flag: <><MapPin size={12}/> US</>, backendIdx: 1 },
  { name: 'Nxsha', flag: <><MapPin size={12}/> US</>, backendIdx: 2 },
  { name: 'Cinemaos', flag: <><MapPin size={12}/> US</>, backendIdx: 3 },
  { name: 'Prime', flag: <><MapPin size={12}/> US</>, backendIdx: 4 },
  { name: 'Streamflix', flag: <><MapPin size={12}/> US</>, backendIdx: 0 },
  { name: 'Vidpro', flag: <><MapPin size={12}/> UK</>, backendIdx: 2 },
  { name: 'Nova', flag: <><MapPin size={12}/> UK</>, backendIdx: 3 },
  { name: 'Echo', flag: <><MapPin size={12}/> US</>, backendIdx: 4 },
  { name: 'Bravo', flag: <><MapPin size={12}/> UK</>, backendIdx: 0 },
  { name: 'Vidking', flag: <><MapPin size={12}/> US</>, backendIdx: 2 },
  { name: 'Drive', flag: <><MapPin size={12}/> UK</>, backendIdx: 3 },
  { name: 'Hdmovies', flag: <><MapPin size={12}/> IN</>, backendIdx: 2 },
  { name: 'Asia', flag: <><MapPin size={12}/> IN</>, backendIdx: 0 },
  { name: 'Spencer', flag: <><MapPin size={12}/> US</>, backendIdx: 3 },
  { name: 'Lima', flag: <><MapPin size={12}/> US</>, backendIdx: 4 },
  { name: 'Hindi', flag: <><MapPin size={12}/> IN</>, backendIdx: 2 },
  { name: 'Tamil', flag: <><MapPin size={12}/> IN</>, backendIdx: 3 },
  { name: 'Telugu', flag: <><MapPin size={12}/> IN</>, backendIdx: 0 },
  { name: 'Arab', flag: <><MapPin size={12}/> SA</>, backendIdx: 2 },
  { name: 'French', flag: <><MapPin size={12}/> FR</>, backendIdx: 3 },
  { name: 'Spanish', flag: <><MapPin size={12}/> ES</>, backendIdx: 0 },
  { name: 'Brazil', flag: <><MapPin size={12}/> BR</>, backendIdx: 2 },
];

// Generate the final SOURCES array
const SOURCES = SERVER_CONFIGS.map((config, index) => {
  const backend = BACKENDS[config.backendIdx];
  return {
    id: `server-${index}`,
    name: config.name,
    flag: config.flag,
    movieUrl: backend.urlFuncMovie,
    tvUrl: backend.urlFuncTv,
    checkUrl: backend.checkUrl
  };
});

const Watch = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [similarContent, setSimilarContent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeSource, setActiveSource] = useState(() => {
    const saved = localStorage.getItem('xstream_preferred_server');
    if (saved) {
      const found = SOURCES.find(s => s.id === saved);
      if (found) return found;
    }
    return SOURCES[0];
  });
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(parseInt(searchParams.get('s')) || 1);
  const [selectedEpisode, setSelectedEpisode] = useState(parseInt(searchParams.get('e')) || 1);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [serverStatuses, setServerStatuses] = useState({});

  const { user } = useAuth();
  const { addToHistory } = useUserData();

  const playerContainerRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowServerMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save preference when changed
  useEffect(() => {
    localStorage.setItem('xstream_preferred_server', activeSource.id);
  }, [activeSource]);

  // Fetch details & similar
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const detailsData = await fetchDetails(type, id);
        setDetails(detailsData);
        
        // Log to watch history
        if (detailsData) {
          addToHistory({
            id: detailsData.id,
            media_type: type,
            title: detailsData.title || detailsData.name,
            imageSrc: getImageUrl(detailsData.poster_path),
            releaseYear: (detailsData.release_date || detailsData.first_air_date || '').substring(0, 4),
            rating: detailsData.vote_average || 0
          });
        }
        
        const similarData = await fetchSimilar(type, id);
        setSimilarContent(similarData.slice(0, 10)); // Top 10 similar
      } catch (error) {
        console.error('Failed to fetch watch data', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [type, id]);

  // Save Watch History
  useEffect(() => {
    const saveHistory = async () => {
      if (!user || !details) return;
      try {
        const payload = {
          user_id: user.id,
          media_id: id,
          media_type: type,
          title: details.title || details.name,
          poster_path: details.poster_path,
          season: type === 'tv' ? selectedSeason : null,
          episode: type === 'tv' ? selectedEpisode : null
        };
        
        await supabase.from('watch_history').upsert(payload, { onConflict: 'user_id, media_id, media_type' });
      } catch (err) {
        console.error("Failed to save history", err);
      }
    };
    
    // Save history 5 seconds after loading the stream
    const timer = setTimeout(saveHistory, 5000);
    return () => clearTimeout(timer);
  }, [user, details, type, id, selectedSeason, selectedEpisode]);

  // Background Health Check logic
  useEffect(() => {
    // Start by marking everything online
    const initialStatuses = {};
    SOURCES.forEach(s => { initialStatuses[s.id] = 'online'; });
    setServerStatuses(initialStatuses);

    // Then do a background check — only mark offline if truly unreachable
    const uniqueBackends = [...new Set(SOURCES.map(s => s.checkUrl))];
    uniqueBackends.forEach(checkUrl => {
      fetch(checkUrl, { mode: 'no-cors', cache: 'no-store' })
        .then(() => {
          // no-cors returns opaque response, but if it resolves, server is reachable
          setServerStatuses(prev => {
            const next = { ...prev };
            SOURCES.forEach(s => {
              if (s.checkUrl === checkUrl) next[s.id] = 'online';
            });
            return next;
          });
        })
        .catch(() => {
          // Only mark offline if fetch completely fails (network error)
          setServerStatuses(prev => {
            const next = { ...prev };
            SOURCES.forEach(s => {
              if (s.checkUrl === checkUrl) next[s.id] = 'offline';
            });
            return next;
          });
        });
    });
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      
      if (key === 'f') {
        toggleFullscreen();
      }
      if (key === 's') {
        // Cycle to next server
        const currentIdx = SOURCES.findIndex(s => s.id === activeSource.id);
        const nextIdx = (currentIdx + 1) % SOURCES.length;
        setActiveSource(SOURCES[nextIdx]);
        setIframeLoaded(false);
      }
      if (key === 'n' && type === 'tv') {
        // Next episode
        if (selectedEpisode < totalEpisodes) {
          setSelectedEpisode(prev => prev + 1);
          setIframeLoaded(false);
        } else if (selectedSeason < totalSeasons) {
          setSelectedSeason(prev => prev + 1);
          setSelectedEpisode(1);
          setIframeLoaded(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSource, type, selectedEpisode, selectedSeason, totalEpisodes, totalSeasons]);

  const streamUrl = type === 'movie' 
    ? activeSource.movieUrl(id) 
    : activeSource.tvUrl(id, selectedSeason, selectedEpisode);

  const title = details?.title || details?.name || '';
  const totalSeasons = details?.number_of_seasons || 0;
  const totalEpisodes = details?.seasons?.find(s => s.season_number === selectedSeason)?.episode_count || 0;

  if (loading) {
    return (
      <div className="watch-loading">
        <Loader2 className="watch-spinner-icon" size={40} />
        <p>Connecting to secure servers...</p>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <div className="watch-player-section" ref={playerContainerRef}>
        
        {/* Custom Overlay Top Bar (Inside Player Area) */}
        <div className={`player-overlay-top ${isFullscreen ? 'fullscreen-overlay' : ''}`}>
          <div className="overlay-left">
            <button className="overlay-icon-btn back-btn" onClick={() => navigate(`/details/${type}/${id}`)} title="Back to Details">
              <ArrowLeft size={22} />
            </button>

            {/* Server Dropdown inside overlay */}
            <div className="custom-server-dropdown" ref={menuRef}>
              <button 
                className="server-select-trigger" 
                onClick={() => setShowServerMenu(!showServerMenu)}
              >
                <span className="trigger-flag">{activeSource.flag}</span>
                <span className="trigger-name">{activeSource.name}</span>
                <ChevronDown size={16} className={`trigger-icon ${showServerMenu ? 'open' : ''}`} />
              </button>

              {showServerMenu && (
                <div className="server-options-menu">
                  <div className="menu-header">
                    <span>Select Server</span>
                    <span className="live-status-info"><span className="dot online"></span> Live Checking</span>
                  </div>
                  <div className="server-options-grid">
                    {SOURCES.map((source) => {
                      const isActive = activeSource.id === source.id;
                      const status = serverStatuses[source.id];
                      
                      return (
                        <button
                          key={source.id}
                          className={`server-option-btn ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setActiveSource(source);
                            setShowServerMenu(false);
                            setIframeLoaded(false);
                          }}
                        >
                          <div className="option-left">
                            <span className="option-flag">{source.flag}</span>
                            <span className="option-name">{source.name}</span>
                          </div>
                          <div className="option-right">
                            {status === 'online' ? <CheckCircle2 size={16} className="status-icon green" /> :
                             status === 'offline' ? <XCircle size={16} className="status-icon red" /> :
                             <Loader2 size={16} className="status-icon spinning" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Dummy download button for aesthetics matching screenshot */}
            <button className="overlay-icon-btn download-btn" title="Download Offline">
              <Download size={20} />
            </button>
          </div>

          <div className="overlay-center">
            <div className="now-playing-info">
              <span className="now-playing-label">Now Playing</span>
              <span className="now-playing-title">
                {title} {type === 'tv' ? `• S${selectedSeason}:E${selectedEpisode}` : ''}
              </span>
            </div>
          </div>
          
          <div className="overlay-right">
             <button className="overlay-icon-btn fs-btn" onClick={toggleFullscreen} title="Fullscreen">
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>

        {/* The actual iframe player */}
        <div className="watch-player-container">
          {!iframeLoaded && (
            <div className="player-loading-overlay">
              <Loader2 className="watch-spinner-icon" size={40} />
              <p>Initializing {activeSource.name} stream...</p>
            </div>
          )}
          <iframe
            key={`${activeSource.id}-${selectedSeason}-${selectedEpisode}`}
            src={streamUrl}
            className="watch-iframe"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="no-referrer"
            title={`${title} - ${activeSource.name}`}
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      </div>

      {/* TV Season/Episode Selector */}
      {type === 'tv' && totalSeasons > 0 && (
        <div className="episode-selector">
          <div className="episode-selector-header">
            <h2><Tv size={20} /> Episodes</h2>
          </div>

          <div className="season-tabs">
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(sNum => (
              <button
                key={sNum}
                className={`season-tab ${selectedSeason === sNum ? 'active' : ''}`}
                onClick={() => { setSelectedSeason(sNum); setSelectedEpisode(1); setIframeLoaded(false); }}
              >
                Season {sNum}
              </button>
            ))}
          </div>

          <div className="episode-grid">
            {totalEpisodes > 0 ? (
              Array.from({ length: totalEpisodes }, (_, i) => i + 1).map(eNum => (
                <button
                  key={eNum}
                  className={`episode-btn ${selectedEpisode === eNum ? 'active' : ''}`}
                  onClick={() => { setSelectedEpisode(eNum); setIframeLoaded(false); }}
                >
                  <Film size={14} />
                  <span>Ep {eNum}</span>
                </button>
              ))
            ) : (
              <p className="no-episodes">Episode data not available for this season.</p>
            )}
          </div>
        </div>
      )}

      {/* Media Details Section */}
      {details && (
        <div className="watch-details-section">
          <h2 className="watch-details-title">{title}</h2>
          <div className="watch-details-meta">
            <span className="watch-details-type">{type === 'movie' ? 'MOVIE' : 'TV SHOW'}</span>
            {details?.release_date && <span>{details.release_date.split('-')[0]}</span>}
            {details?.first_air_date && <span>{details.first_air_date.split('-')[0]}</span>}
            <span className="watch-details-rating"><Star size={14} fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }}/> {details?.vote_average?.toFixed(1)}</span>
          </div>
          <p className="watch-details-overview">{details?.overview}</p>
          
          <div className="watch-details-genres">
            {details?.genres?.map(g => (
              <span key={g.id} className="genre-pill">{g.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Content Section */}
      {similarContent.length > 0 && (
        <div className="watch-suggested-section">
          <h2 className="suggested-title">More Like This</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
            {similarContent.map(item => {
              const itemTitle = item.title || item.name;
              const itemYear = item.release_date ? item.release_date.split('-')[0] : (item.first_air_date ? item.first_air_date.split('-')[0] : '');
              const itemImage = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
              
              return (
                <MovieCard 
                  key={item.id} 
                  id={item.id}
                  title={itemTitle}
                  imageSrc={itemImage}
                  media_type={item.media_type || type}
                  releaseYear={itemYear}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
