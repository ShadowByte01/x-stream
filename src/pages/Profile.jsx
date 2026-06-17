import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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

      <div className="profile-sections">
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
      </div>
    </motion.div>
  );
};

export default Profile;
