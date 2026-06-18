import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Play, Plus, Check, ChevronRight, Star, Clock, Film, Zap, ArrowRight, Send, Loader2, Smile, Heart, Brain, Flame, Moon, AlertTriangle } from 'lucide-react';
import { MOODS, LANGUAGES, CINEMATIC_POSTERS } from '../../lib/groq';
import { getRecommendations } from '../../lib/groq';
import { useActions } from '../../lib/useStore';
import './AIRecommend.css';

/* ─── Icon map for mood buttons ─── */
const MOOD_ICONS = { Smile, Heart, Brain, Flame, Moon };

/* ─── Inline AI Section (placed on the Home page) ─── */
export function AISection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ai-inline-section">
      <div className="ai-inline-inner">
        <div className="ai-inline-text">
          <div className="ai-inline-badge">
            <Sparkles size={14} />
            <span>AI Powered</span>
          </div>
          <h2 className="ai-inline-title">
            Can't decide what to watch?
          </h2>
          <p className="ai-inline-subtitle">
            Let <strong>XAI</strong> analyse your mood and find the perfect movie for you right now.
          </p>
        </div>
        <motion.button
          className="ai-inline-btn"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={18} />
          <span>Get Recommendations</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>
      <AIRecommendModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

/* ─── Cinematic Loading ─── */
const CinematicLoading = ({ message }) => {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    const pool = [];
    for (let i = 0; i < 30; i++) {
      pool.push(CINEMATIC_POSTERS[Math.floor(Math.random() * CINEMATIC_POSTERS.length)]);
    }
    setPosters(pool);
  }, []);

  return (
    <div className="cinematic-loader">
      <div className="cl-vignette" />

      {/* Scrolling poster strips */}
      <div className="cl-strip cl-strip-left">
        <div className="cl-strip-inner">
          {posters.map((p, i) => (
            <div key={`l${i}`} className="cl-poster-card">
              <img src={p} alt="" loading="eager" />
            </div>
          ))}
          {posters.map((p, i) => (
            <div key={`l2${i}`} className="cl-poster-card">
              <img src={p} alt="" loading="eager" />
            </div>
          ))}
        </div>
      </div>
      <div className="cl-strip cl-strip-right">
        <div className="cl-strip-inner reverse">
          {[...posters].reverse().map((p, i) => (
            <div key={`r${i}`} className="cl-poster-card">
              <img src={p} alt="" loading="eager" />
            </div>
          ))}
          {[...posters].reverse().map((p, i) => (
            <div key={`r2${i}`} className="cl-poster-card">
              <img src={p} alt="" loading="eager" />
            </div>
          ))}
        </div>
      </div>

      {/* Center orb */}
      <div className="cl-center">
        <motion.div
          className="cl-orb"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="cl-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="cl-ring cl-ring-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <div className="cl-icon">
          <Sparkles size={28} />
        </div>
      </div>

      {/* Stage text */}
      <div className="cl-text">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="cl-stage-text"
        >
          {message}
        </motion.p>
        <div className="cl-dots">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              className="cl-dot"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Result Card ─── */
const ResultCard = ({ rec, index, navigate, isInWatchlist, onToggleWatchlist }) => {
  const matchColor = rec.match >= 95 ? '#4ade80' : rec.match >= 85 ? '#facc15' : '#fb923c';

  return (
    <motion.div
      className="ai-result-card"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.06, 0.8), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => rec.id && navigate(`/details/${rec.media_type || 'movie'}/${rec.id}`)}
    >
      {/* Match Badge */}
      <div className="ai-match-badge" style={{ '--match-color': matchColor }}>
        <motion.span
          className="ai-match-num"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: Math.min(index * 0.06 + 0.3, 1.1), type: 'spring', stiffness: 200 }}
        >
          {rec.match}%
        </motion.span>
        <span className="ai-match-label">match</span>
      </div>

      {index === 0 && <div className="ai-best-pick">BEST PICK</div>}

      <div className="ai-result-inner">
        {/* Poster */}
        <div className="ai-result-poster">
          {rec.poster ? (
            <img src={rec.poster} alt={rec.title} />
          ) : (
            <div className="ai-result-poster-placeholder">
              <Film size={32} />
            </div>
          )}
          {rec.rating && (
            <div className="ai-result-rating">
              <Star size={10} fill="currentColor" /> {rec.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="ai-result-info">
          <h3 className="ai-result-title">{rec.title}</h3>
          <div className="ai-result-meta">
            {rec.year && <span>{rec.year}</span>}
            {rec.runtime && <span><Clock size={11} /> {rec.runtime}m</span>}
            {rec.genres?.length > 0 && (
              <span className="ai-genre-chips">
                {rec.genres.slice(0, 2).map(g => (
                  <span key={g} className="ai-genre-chip">{g}</span>
                ))}
              </span>
            )}
          </div>
          <p className="ai-result-reason">{rec.reason}</p>
          <div className="ai-result-actions" onClick={e => e.stopPropagation()}>
            {rec.id && (
              <button
                className="ai-action-btn primary"
                onClick={() => navigate(`/watch/${rec.media_type || 'movie'}/${rec.id}`)}
              >
                <Play size={14} fill="currentColor" /> Watch
              </button>
            )}
            {rec.id && (
              <button
                className={`ai-action-btn ${isInWatchlist ? 'in-list' : ''}`}
                onClick={() => onToggleWatchlist({
                  id: rec.id,
                  media_type: rec.media_type || 'movie',
                  title: rec.title,
                  imageSrc: rec.poster,
                  releaseYear: String(rec.year),
                  rating: rec.rating || 0,
                })}
              >
                {isInWatchlist ? <Check size={14} /> : <Plus size={14} />}
              </button>
            )}
            {rec.id && (
              <button
                className="ai-action-btn icon-only"
                onClick={() => navigate(`/details/${rec.media_type || 'movie'}/${rec.id}`)}
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Modal ─── */
export const AIRecommendModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useActions();

  const [stage, setStage] = useState('input'); // input | loading | results | error
  const [selectedMood, setSelectedMood] = useState(null);
  const [customText, setCustomText] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [results, setResults] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const customInputRef = useRef(null);

  // Loading stage messages that cycle
  const loadingMessages = [
    'Analyzing your mood vibes...',
    'Scanning through thousands of movies...',
    'Matching cinematic DNA patterns...',
    'Finding the perfect picks for you...',
    'Almost there, curating your list...',
    'Cross-referencing genres and ratings...',
    'Finalizing your 15 handpicked movies...',
  ];

  useEffect(() => {
    if (stage !== 'loading') return;
    let i = 0;
    setLoadingMsg(loadingMessages[0]);
    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[i]);
    }, 2200);
    return () => clearInterval(interval);
  }, [stage]);

  const handleRecommend = async () => {
    if (!selectedMood) return;

    setStage('loading');
    setErrorMsg('');

    try {
      const recs = await getRecommendations({
        mood: selectedMood,
        customText: customText.trim(),
        language: selectedLang,
      });
      setResults(recs);
      setTimeout(() => setStage('results'), 600);
    } catch (err) {
      console.error('AI Recommend error:', err);
      setErrorMsg(err?.response?.data?.error?.message || err.message || 'Something went wrong. Try again.');
      setStage('error');
    }
  };

  const handleClose = () => {
    setStage('input');
    setSelectedMood(null);
    setCustomText('');
    setSelectedLang('en');
    setResults([]);
    setErrorMsg('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="ai-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal wrapper — flexbox-centered on all screen sizes */}
          <div className="ai-modal-wrapper">
            <motion.div
              className="ai-modal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
            {/* Shine effect on modal */}
            <div className="ai-modal-shine" />

            {/* Header */}
            <div className="ai-modal-header">
              <div className="ai-modal-brand">
                <div className="ai-modal-brand-icon">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2>XAI Recommends</h2>
                  <p>AI-powered movie picks tailored to your mood</p>
                </div>
              </div>
              <button className="ai-modal-close" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>

            {/* INPUT STAGE */}
            <AnimatePresence mode="wait">
              {stage === 'input' && (
                <motion.div
                  className="ai-modal-body"
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Mood Selection */}
                  <div className="ai-section">
                    <label className="ai-section-label">
                      <Zap size={14} /> What's your vibe right now?
                    </label>
                    <div className="ai-mood-grid">
                      {MOODS.map(mood => (
                        <motion.button
                          key={mood.id}
                          className={`ai-mood-btn ${selectedMood === mood.id ? 'active' : ''}`}
                          onClick={() => setSelectedMood(mood.id)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <span className="ai-mood-icon">{React.createElement(MOOD_ICONS[mood.icon], { size: 22 })}</span>
                          <span className="ai-mood-label">{mood.label}</span>
                          <span className="ai-mood-desc">{mood.desc}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="ai-section">
                    <label className="ai-section-label">
                      <Film size={14} /> Preferred language
                    </label>
                    <div className="ai-lang-row">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.id}
                          className={`ai-lang-btn ${selectedLang === lang.id ? 'active' : ''}`}
                          onClick={() => setSelectedLang(lang.id)}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom input */}
                  <div className="ai-section">
                    <label className="ai-section-label">
                      <Send size={14} /> Tell XAI more (optional)
                    </label>
                    <div className="ai-custom-input-wrap">
                      <textarea
                        ref={customInputRef}
                        className="ai-custom-input"
                        placeholder="e.g. I want a movie about time travel with a twist ending, or something like Inception meets Interstellar..."
                        value={customText}
                        onChange={e => setCustomText(e.target.value)}
                        rows={3}
                        maxLength={300}
                      />
                      <span className="ai-char-count">{customText.length}/300</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    className={`ai-cta-btn ${!selectedMood ? 'disabled' : ''}`}
                    onClick={handleRecommend}
                    disabled={!selectedMood}
                    whileHover={selectedMood ? { scale: 1.02, y: -2 } : {}}
                    whileTap={selectedMood ? { scale: 0.98 } : {}}
                  >
                    <Sparkles size={20} />
                    <span>Get My Recommendations</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}

              {/* LOADING STAGE */}
              {stage === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CinematicLoading message={loadingMsg} />
                </motion.div>
              )}

              {/* RESULTS STAGE */}
              {stage === 'results' && (
                <motion.div
                  className="ai-modal-body ai-results-body"
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="ai-results-header">
                    <Sparkles size={20} className="ai-results-sparkle" />
                    <h3>Here's what XAI picked for you</h3>
                  </div>
                  <div className="ai-results-list">
                    {results.map((rec, i) => (
                      <ResultCard
                        key={rec.title + i}
                        rec={rec}
                        index={i}
                        navigate={navigate}
                        isInWatchlist={rec.id ? isInWatchlist(rec.id, rec.media_type || 'movie') : false}
                        onToggleWatchlist={toggleWatchlist}
                      />
                    ))}
                  </div>
                  <div className="ai-results-footer">
                    <button className="ai-retry-btn" onClick={() => setStage('input')}>
                      <Sparkles size={16} /> Try a different mood
                    </button>
                    <button className="ai-close-results-btn" onClick={handleClose}>
                      <X size={16} /> Close
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ERROR STAGE */}
              {stage === 'error' && (
                <motion.div
                  className="ai-modal-body ai-error-body"
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="ai-error-icon"><AlertTriangle size={36} /></div>
                  <h3>Oops, something went wrong</h3>
                  <p>{errorMsg}</p>
                  <div className="ai-error-actions">
                    <button className="ai-retry-btn" onClick={handleRecommend}>
                      <Loader2 size={16} /> Try Again
                    </button>
                    <button className="ai-close-results-btn" onClick={() => setStage('input')}>
                      <ArrowRight size={16} /> Go Back
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
