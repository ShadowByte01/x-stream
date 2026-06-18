import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchDetails, fetchExternalIds, fetchSimilar, getImageUrl } from '../tmdb';
import { ArrowLeft, Maximize2, Minimize2, Tv, Film, ChevronDown, CheckCircle2, XCircle, Loader2, Download, Zap, Star } from 'lucide-react';
import { useActions, usePrefs } from '../lib/useStore';
import MovieCard from '../components/MovieCard/MovieCard';
import MostViewedBadge from '../components/MostViewedBadge/MostViewedBadge';
import './Watch.css';

// 5 genuinely DIFFERENT embed providers
const BACKENDS = [
  { urlFuncMovie: (id) => `https://vidlink.pro/movie/${id}`, urlFuncTv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`, checkUrl: 'https://vidlink.pro' },
  { urlFuncMovie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`, urlFuncTv: (id, s, e) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`, checkUrl: 'https://vidsrc.me' },
  { urlFuncMovie: (id) => `https://vidsrc.pro/embed/movie/${id}`, urlFuncTv: (id, s, e) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`, checkUrl: 'https://vidsrc.pro' },
  { urlFuncMovie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`, urlFuncTv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`, checkUrl: 'https://vidsrc.cc' },
  { urlFuncMovie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, urlFuncTv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`, checkUrl: 'https://multiembed.mov' },
  { urlFuncMovie: (id) => `https://peachify.top/embed/movie/${id}`, urlFuncTv: (id, s, e) => `https://peachify.top/embed/tv/${id}/${s}/${e}`, checkUrl: 'https://peachify.top' },
];

const SERVER_CONFIGS = [
  { name: 'Peachify', flag: <Zap size={14} fill="#ffb7b2" color="#ffb7b2" />, backendIdx: 5 },
  { name: 'Xstream', flag: <Zap size={14} />, backendIdx: 0 },
  { name: 'Xstream Pro', flag: <Zap size={14} />, backendIdx: 1 },
  { name: 'Xstream Premium', flag: <Star size={14} fill="currentColor" />, backendIdx: 2 },
  { name: 'Xstream Ultra', flag: <Zap size={14} />, backendIdx: 3 },
  { name: 'Xstream Max', flag: <Zap size={14} />, backendIdx: 4 },
  { name: 'Turbo', flag: <><span style={{fontSize:11}}>🇺🇸</span></>, backendIdx: 0 },
  { name: 'NHD', flag: <><span style={{fontSize:11}}>🇮🇳</span></>, backendIdx: 1 },
  { name: '4K', flag: <><span style={{fontSize:11}}>🇬🇧</span></>, backendIdx: 2 },
  { name: 'Premium', flag: <><span style={{fontSize:11}}>🇺🇸</span></>, backendIdx: 3 },
  { name: 'MultiEmbed', flag: <><span style={{fontSize:11}}>🇦🇺</span></>, backendIdx: 4 },
];

const SOURCES = SERVER_CONFIGS.map((config, index) => {
  const backend = BACKENDS[config.backendIdx];
  return {
    id: `server-${index}`,
    name: config.name,
    flag: config.flag,
    movieUrl: backend.urlFuncMovie,
    tvUrl: backend.urlFuncTv,
    checkUrl: backend.checkUrl,
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
      const found = SOURCES.find((s) => s.id === saved);
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

  const prefs = usePrefs();
  const {
    addToHistory,
    updateProgress,
    registerView,
    isMostViewed,
  } = useActions();

  const playerContainerRef = useRef(null);
  const menuRef = useRef(null);

  const mv = details ? isMostViewed(Number(details.id), type) : false;

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

  // Save preferred server
  useEffect(() => {
    localStorage.setItem('xstream_preferred_server', activeSource.id);
  }, [activeSource]);

  // Fetch details, similar, and record history + view count
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const detailsData = await fetchDetails(type, id);
        setDetails(detailsData);

        if (detailsData) {
          const mediaData = {
            id: detailsData.id,
            media_type: type,
            title: detailsData.title || detailsData.name,
            poster_path: detailsData.poster_path,
            imageSrc: getImageUrl(detailsData.poster_path),
            backdrop_path: detailsData.backdrop_path,
            releaseYear: (detailsData.release_date || detailsData.first_air_date || '').substring(0, 4),
            rating: detailsData.vote_average || 0,
            overview: detailsData.overview,
            season: type === 'tv' ? selectedSeason : null,
            episode: type === 'tv' ? selectedEpisode : null,
          };
          addToHistory(mediaData);
          registerView(detailsData.id, type);
        }

        const similarData = await fetchSimilar(type, id);
        setSimilarContent(similarData.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch watch data', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [type, id]);

  // Peachify Event Listener for progress tracking
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://peachify.top') return;
      if (event.data?.type === 'MEDIA_DATA') {
        const pd = event.data.data;
        localStorage.setItem('peachifyProgress', JSON.stringify(pd));
        // Update history progress if we have duration info
        if (pd?.duration && pd?.currentTime) {
          const pct = Math.round((pd.currentTime / pd.duration) * 100);
          updateProgress(Number(id), type, pct, selectedSeason, selectedEpisode);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [id, type, selectedSeason, selectedEpisode]);

  // Background server health check
  useEffect(() => {
    const initialStatuses = {};
    SOURCES.forEach((s) => {
      initialStatuses[s.id] = 'online';
    });
    setServerStatuses(initialStatuses);
    const uniqueBackends = [...new Set(SOURCES.map((s) => s.checkUrl))];
    uniqueBackends.forEach((checkUrl) => {
      fetch(checkUrl, { mode: 'no-cors', cache: 'no-store' })
        .then(() => {
          setServerStatuses((prev) => {
            const next = { ...prev };
            SOURCES.forEach((s) => {
              if (s.checkUrl === checkUrl) next[s.id] = 'online';
            });
            return next;
          });
        })
        .catch(() => {
          setServerStatuses((prev) => {
            const next = { ...prev };
            SOURCES.forEach((s) => {
              if (s.checkUrl === checkUrl) next[s.id] = 'offline';
            });
            return next;
          });
        });
    });
  }, []);

  // Auto-play next episode
  const totalSeasons = details?.number_of_seasons || 0;
  const totalEpisodes =
    details?.seasons?.find((s) => s.season_number === selectedSeason)?.episode_count || 0;

  const playNextEpisode = () => {
    if (type !== 'tv') return;
    if (selectedEpisode < totalEpisodes) {
      setSelectedEpisode((p) => p + 1);
    } else if (selectedSeason < totalSeasons) {
      setSelectedSeason((p) => p + 1);
      setSelectedEpisode(1);
    }
    setIframeLoaded(false);
  };

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
      if (key === 'f') toggleFullscreen();
      if (key === 's') {
        const idx = SOURCES.findIndex((s) => s.id === activeSource.id);
        setActiveSource(SOURCES[(idx + 1) % SOURCES.length]);
        setIframeLoaded(false);
      }
      if (key === 'n' && type === 'tv') playNextEpisode();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSource, type, selectedEpisode, selectedSeason, totalEpisodes, totalSeasons]);

  const streamUrl =
    type === 'movie' ? activeSource.movieUrl(id) : activeSource.tvUrl(id, selectedSeason, selectedEpisode);
  const title = details?.title || details?.name || '';

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
        {/* Overlay Top Bar */}
        <div className={`player-overlay-top ${isFullscreen ? 'fullscreen-overlay' : ''}`}>
          <div className="overlay-left">
            <button className="overlay-icon-btn back-btn" onClick={() => navigate(`/details/${type}/${id}`)} title="Back">
              <ArrowLeft size={22} />
            </button>
            <div className="custom-server-dropdown" ref={menuRef}>
              <button className="server-select-trigger" onClick={() => setShowServerMenu(!showServerMenu)}>
                <span className="trigger-flag">{activeSource.flag}</span>
                <span className="trigger-name">{activeSource.name}</span>
                <ChevronDown size={16} className={`trigger-icon ${showServerMenu ? 'open' : ''}`} />
              </button>
              {showServerMenu && (
                <div className="server-options-menu">
                  <div className="menu-header">
                    <span>Select Server</span>
                    <span className="live-status-info">
                      <span className="dot online" /> Live Checking
                    </span>
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
                            {status === 'online' ? (
                              <CheckCircle2 size={16} className="status-icon green" />
                            ) : status === 'offline' ? (
                              <XCircle size={16} className="status-icon red" />
                            ) : (
                              <Loader2 size={16} className="status-icon spinning" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {mv && <MostViewedBadge variant="pill" />}
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
            {type === 'tv' && (
              <button className="overlay-icon-btn" onClick={playNextEpisode} title="Next Episode (N)">
                <span style={{ fontSize: 12, fontWeight: 700 }}>NEXT</span>
              </button>
            )}
            <button className="overlay-icon-btn fs-btn" onClick={toggleFullscreen} title="Fullscreen (F)">
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>

        {/* Player iframe */}
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
            <h2>
              <Tv size={20} /> Episodes
            </h2>
          </div>
          <div className="season-tabs">
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((sNum) => (
              <button
                key={sNum}
                className={`season-tab ${selectedSeason === sNum ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSeason(sNum);
                  setSelectedEpisode(1);
                  setIframeLoaded(false);
                }}
              >
                Season {sNum}
              </button>
            ))}
          </div>
          <div className="episode-grid">
            {totalEpisodes > 0 ? (
              Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((eNum) => (
                <button
                  key={eNum}
                  className={`episode-btn ${selectedEpisode === eNum ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedEpisode(eNum);
                    setIframeLoaded(false);
                  }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h2 className="watch-details-title">{title}</h2>
            {mv && <MostViewedBadge variant="pill" />}
          </div>
          <div className="watch-details-meta">
            <span className="watch-details-type">{type === 'movie' ? 'MOVIE' : 'TV SHOW'}</span>
            {details?.release_date && <span>{details.release_date.split('-')[0]}</span>}
            {details?.first_air_date && <span>{details.first_air_date.split('-')[0]}</span>}
            <span className="watch-details-rating">
              <Star size={14} fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }} />{' '}
              {details?.vote_average?.toFixed(1)}
            </span>
          </div>
          <p className="watch-details-overview">{details?.overview}</p>
          <div className="watch-details-genres">
            {details?.genres?.map((g) => (
              <span key={g.id} className="genre-pill">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Content */}
      {similarContent.length > 0 && (
        <div className="watch-suggested-section">
          <h2 className="suggested-title">More Like This</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
            {similarContent.map((item) => (
              <MovieCard
                key={item.id}
                id={item.id}
                title={item.title || item.name}
                imageSrc={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : ''}
                media_type={item.media_type || type}
                releaseYear={item.release_date ? item.release_date.split('-')[0] : (item.first_air_date ? item.first_air_date.split('-')[0] : '')}
                rating={item.vote_average || 0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
