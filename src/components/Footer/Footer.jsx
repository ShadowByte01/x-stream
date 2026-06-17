import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo-section">
          <Link to="/" className="footer-logo-link">
            <img src="/logo.png" alt="X-STREAM" className="footer-logo-img" />
          </Link>
          <p className="footer-tagline">Movies. Series. Endless Entertainment.</p>
        </div>

        <div className="footer-links-container">
          <div className="footer-column">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/series">Series</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/new-popular">New & Popular</Link>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <Link to="#">Help Center</Link>
            <Link to="#">Documents</Link>
            <Link to="#">Account</Link>
            <Link to="#">Supported Devices</Link>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="#">About Us</Link>
            <Link to="#">Careers</Link>
            <Link to="#">Contact Us</Link>
            <Link to="#" className="highlight-link">by XHub</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
            </svg>
          </a>
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM7.6 4C5.6 4 4 5.6 4 7.6V16.4C4 18.4 5.6 20 7.6 20H16.4C18.4 20 20 18.4 20 16.4V7.6C20 5.6 18.4 4 16.4 4H7.6ZM12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9ZM17.25 5.5C17.94 5.5 18.5 6.06 18.5 6.75C18.5 7.44 17.94 8 17.25 8C16.56 8 16 7.44 16 6.75C16 6.06 16.56 5.5 17.25 5.5Z"/>
            </svg>
          </a>
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M21.58 7.19C21.36 6.35 20.7 5.69 19.86 5.47C18.34 5.06 12 5.06 12 5.06S5.66 5.06 4.14 5.47C3.3 5.69 2.64 6.35 2.42 7.19C2 8.7 2 12 2 12S2 15.3 2.42 16.81C2.64 17.65 3.3 18.31 4.14 18.53C5.66 18.94 12 18.94 12 18.94S18.34 18.94 19.86 18.53C20.7 18.31 21.36 17.65 21.58 16.81C22 15.3 22 12 22 12S22 8.7 21.58 7.19ZM10 15L15.5 12L10 9V15Z"/>
            </svg>
          </a>
          <a href="#" className="social-icon" title="Discord">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
            </svg>
          </a>
        </div>
        
        <div className="footer-copyright-info">
          <p>&copy; {new Date().getFullYear()} X-STREAM. All rights reserved.</p>
          <p className="footer-watermark">made by losttweeds.exe with love</p>
        </div>
        
        <p className="footer-disclaimer">X-STREAM does not host any content. All streams are provided by third-party embed services. <strong>by XHub</strong></p>
      </div>
    </footer>
  );
};

export default Footer;
