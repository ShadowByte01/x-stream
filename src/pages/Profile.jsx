import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, PlaySquare, Heart, Star, Trash2, Settings, ShieldCheck, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '../components/MovieCard/MovieCard';
import { useActions, useHistory, useWatchlist, useLikes, useRatings, useConsent, useVisitor } from '../lib/useStore';
import { removeFromHistory } from '../lib/storage';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const history = useHistory();
  const watchlist = useWatchlist();
  const likes = useLikes();
  const ratings = useRatings();
  const { consent, since } = useConsent();
  const visitorId = useVisitor();
  const { removeFromHistory: rmHistory, clearHistory: clrHistory } = useActions();

  const [activeTab, setActiveTab] = useState('history');

  const memberSince = since
    ? since.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown';

  // Map history/wishlist/likes to MovieCard-compatible shape
  const historyCards = history.map((h) => ({
    ...h,
    id: h.id,
    imageSrc: h.imageSrc || h.poster_path,
    media_type: h.media_type,
    releaseYear: h.releaseYear || (h.watched_at || '').substring(0, 4),
    progress: h.progress,
  }));

  const listCards = watchlist.map((w) => ({
    ...w,
    id: w.id,
    imageSrc: w.imageSrc || w.poster_path,
    media_type: w.media_type,
  }));

  const likeCards = likes.map((l) => ({
    ...l,
    id: l.id,
    imageSrc: l.imageSrc || l.poster_path,
    media_type: l.media_type,
  }));

  const tabs = [
    { key: 'history', label: 'Watch History', icon: <PlaySquare size={18} />, count: history.length },
    { key: 'wishlist', label: 'My List', icon: <Heart size={18} />, count: watchlist.length },
    { key: 'liked', label: 'Liked', icon: <Star size={18} />, count: likes.length },
  ];

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <div className="profile-avatar-large">
          <div className="profile-avatar-inner">
            <User size={42} strokeWidth={1.2} />
          </div>
          <div className="profile-avatar-ring" />
        </div>
        <div className="profile-user-info">
          <h1 className="profile-name">My Xstream</h1>
          <div className="profile-detail">
            <ShieldCheck size={14} />
            <span>No sign-in · Your data stays here</span>
          </div>
          <div className="profile-detail">
            <Cookie size={14} />
            <span>Cookies {consent === 'accepted' ? 'accepted' : consent === 'declined' ? 'declined' : 'not chosen'}</span>
          </div>
          <div className="profile-detail">
            <Clock size={14} />
            <span>Active since {memberSince}</span>
          </div>
          {visitorId && (
            <div className="profile-detail">
              <User size={14} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', opacity: 0.5 }}>{visitorId.substring(0, 8)}…</span>
            </div>
          )}
        </div>
      </div>

      {/* Personal Ratings Overview */}
      {Object.keys(ratings).length > 0 && (
        <div className="profile-ratings-summary">
          <Star size={18} />
          <span>You&apos;ve rated {Object.keys(ratings).length} title{Object.keys(ratings).length > 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="profile-content">
        <AnimatePresence mode="wait">
          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="profile-tab-panel">
              {history.length > 0 ? (
                <>
                  <div className="profile-tab-header">
                    <span>{history.length} title{history.length > 1 ? 's' : ''} watched</span>
                    <button className="profile-clear-btn" onClick={() => { clrHistory(); }}>
                      <Trash2 size={14} /> Clear All
                    </button>
                  </div>
                  <div className="profile-grid">
                    {historyCards.map((item) => (
                      <MovieCard
                        key={`h-${item.id}`}
                        {...item}
                        onRemove={() => removeFromHistory(item.id, item.media_type)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="profile-empty-list">
                  <PlaySquare size={48} />
                  <p>You haven&apos;t watched anything yet.</p>
                  <button className="glow-button" onClick={() => navigate('/')}>Browse Movies</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="profile-tab-panel">
              {watchlist.length > 0 ? (
                <div className="profile-grid">
                  {listCards.map((item) => (
                    <MovieCard key={`w-${item.id}`} {...item} />
                  ))}
                </div>
              ) : (
                <div className="profile-empty-list">
                  <Heart size={48} />
                  <p>Your list is empty. Add movies to watch later!</p>
                  <button className="glow-button" onClick={() => navigate('/')}>Browse Movies</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'liked' && (
            <motion.div key="liked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="profile-tab-panel">
              {likes.length > 0 ? (
                <div className="profile-grid">
                  {likeCards.map((item) => (
                    <MovieCard key={`l-${item.id}`} {...item} />
                  ))}
                </div>
              ) : (
                <div className="profile-empty-list">
                  <Star size={48} />
                  <p>No liked titles yet.</p>
                  <button className="glow-button" onClick={() => navigate('/')}>Browse Movies</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Profile;
