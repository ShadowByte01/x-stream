import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './Verify.css';

const Verify = () => {
  const navigate = useNavigate();

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-icon-wrapper">
          <CheckCircle size={80} className="verify-icon" />
        </div>
        <h1 className="verify-title">Email Verified!</h1>
        <p className="verify-subtitle">Your account is now fully active. Welcome to X-STREAM.</p>
        <button className="verify-btn" onClick={() => navigate('/')}>
          Click to Continue
        </button>
      </div>
    </div>
  );
};

export default Verify;
