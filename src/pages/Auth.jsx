import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import { AlertCircle } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

const Auth = () => {
  const [authMode, setAuthMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const resetMessages = () => {
    setError('');
    setSuccessMsg('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    resetMessages();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (!captchaToken) throw new Error('Please complete the CAPTCHA security check.');
      const { error } = await signUp(email, password, captchaToken);
      if (error) throw error;
      setSuccessMsg('Account created! Please check your email to confirm, then sign in.');
      setAuthMode('login');
      setConfirmPassword('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      if (!captchaToken) throw new Error('Please complete the CAPTCHA security check.');
      const { error } = await signIn(email, password, captchaToken);
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background-overlay"></div>
      <div className="auth-header">
        <h1 className="auth-logo" onClick={() => navigate('/')}>X-STREAM</h1>
      </div>
      <div className="auth-container">
        {authMode === 'signup' && <h2 className="auth-title">Sign Up</h2>}
        {authMode === 'login' && <h2 className="auth-title">Sign In</h2>}
        
        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        {successMsg && (
          <div className="auth-error success">
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN UP FORM */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="input-group">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={email ? 'has-value' : ''} />
              <label>Email address</label>
            </div>
            <div className="input-group">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={password ? 'has-value' : ''} />
              <label>Password</label>
            </div>
            <div className="input-group">
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={confirmPassword ? 'has-value' : ''} />
              <label>Confirm Password</label>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Turnstile siteKey={import.meta.env.VITE_CAPTCHA_SITE_KEY || '1x00000000000000000000AA'} onSuccess={(token) => setCaptchaToken(token)} />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Save & Sign Up'}
            </button>
          </form>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={email ? 'has-value' : ''} />
              <label>Email address</label>
            </div>
            <div className="input-group">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={password ? 'has-value' : ''} />
              <label>Password</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Turnstile siteKey={import.meta.env.VITE_CAPTCHA_SITE_KEY || '1x00000000000000000000AA'} onSuccess={(token) => setCaptchaToken(token)} />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>
        )}

        <div className="auth-toggle">
          {authMode === 'signup' ? (
            <p>Already have an account? <span onClick={() => { setAuthMode('login'); resetMessages(); }}>Sign in.</span></p>
          ) : (
            <p>New to X-STREAM? <span onClick={() => { setAuthMode('signup'); resetMessages(); }}>Click here to register.</span></p>
          )}
        </div>
        
        <div className="auth-captcha-notice">
          <p>This page is protected by Cloudflare Turnstile to ensure you're not a bot.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
