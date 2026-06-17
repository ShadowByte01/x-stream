import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { User, LogOut, Mail, Clock, PlaySquare, Heart, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '../components/MovieCard/MovieCard';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { wishlist, watchHistory, loadingLists } = useUserData();
  const [activeTab, setActiveTab] = useState('history'); // 'history', 'wishlist', 'settings'

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <User size={60} />
          <h2>Not signed in</h2>
          <p>Sign in to see your profile</p>
          <button className="profile-signin-btn" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <div className="profile-avatar-large">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Profile" />
        </div>
        <div className="profile-user-info">
          <h1 className="profile-name">My Profile</h1>
          <div className="profile-detail">
            <Mail size={16} />
            <span>{user.email}</span>
          </div>
          <div className="profile-detail">
            <Clock size={16} />
            <span>Member since {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <PlaySquare size={18} /> Watch History
        </button>
        <button 
          className={`profile-tab ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          <Heart size={18} /> My Wishlist
        </button>
        <button 
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} /> Settings
        </button>
      </div>

      <div className="profile-content">
        <AnimatePresence mode="wait">
          
          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="profile-tab-panel"
            >
              {loadingLists ? (
                <div className="profile-loading">Loading...</div>
              ) : watchHistory.length > 0 ? (
                <div className="profile-grid">
                  {watchHistory.map((item) => (
                    <MovieCard 
                      key={`history-${item.media_id}`}
                      id={item.media_id}
                      title={item.title}
                      imageSrc={item.image_src}
                      media_type={item.media_type}
                      releaseYear={item.release_year}
                      rating={item.rating}
                    />
                  ))}
                </div>
              ) : (
                <div className="profile-empty-list">
                  <PlaySquare size={48} />
                  <p>You haven't watched anything yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <motion.div 
              key="wishlist"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="profile-tab-panel"
            >
              {loadingLists ? (
                <div className="profile-loading">Loading...</div>
              ) : wishlist.length > 0 ? (
                <div className="profile-grid">
                  {wishlist.map((item) => (
                    <MovieCard 
                      key={`wishlist-${item.media_id}`}
                      id={item.media_id}
                      title={item.title}
                      imageSrc={item.image_src}
                      media_type={item.media_type}
                      releaseYear={item.release_year}
                      rating={item.rating}
                    />
                  ))}
                </div>
              ) : (
                <div className="profile-empty-list">
                  <Heart size={48} />
                  <p>Your wishlist is empty. Add movies and shows to watch later!</p>
                </div>
              )}
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="profile-sections"
            >
              <div className="profile-card">
                <h3>Account Settings</h3>
                <div className="profile-card-content">
                  <div className="profile-info-row">
                    <span className="profile-info-label">Email</span>
                    <span className="profile-info-value">{user.email}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">User ID</span>
                    <span className="profile-info-value" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{user.id}</span>
                  </div>
                </div>
              </div>

              <div className="profile-card danger-zone">
                <h3>Session</h3>
                <div className="profile-card-content">
                  <button className="profile-signout-btn" onClick={handleSignOut}>
                    <LogOut size={18} />
                    Sign Out of X-STREAM
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Profile;
