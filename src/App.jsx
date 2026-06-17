import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import MobileNav from './components/MobileNav/MobileNav';
import Home from './pages/Home';
import Series from './pages/Series';
import Movies from './pages/Movies';
import Anime from './pages/Anime';
import NewPopular from './pages/NewPopular';
import Search from './pages/Search';
import Details from './pages/Details';
import Watch from './pages/Watch';
import Auth from './pages/Auth';
import Verify from './pages/Verify';
import Profile from './pages/Profile';
import Person from './pages/Person';
import Company from './pages/Company';
import { AuthProvider } from './context/AuthContext';
import IntroSplash from './components/IntroSplash/IntroSplash';

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Only show intro once per session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  // Load saved accent color
  useEffect(() => {
    const savedColor = localStorage.getItem('xstream_accent_color');
    if (savedColor) {
      document.documentElement.style.setProperty('--accent-color', savedColor);
    }
  }, []);

  const location = useLocation();
  const isWatchPage = location.pathname.startsWith('/watch');
  const isAuthPage = location.pathname.startsWith('/login');

  return (
    <div className="app-container">
      {showIntro && <IntroSplash onComplete={handleIntroComplete} />}
      {!isWatchPage && !isAuthPage && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/series" element={<Series />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/new-popular" element={<NewPopular />} />
          <Route path="/search" element={<Search />} />
          <Route path="/details/:type/:id" element={<Details />} />
          <Route path="/watch/:type/:id" element={<Watch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="/company/:id" element={<Company />} />
        </Routes>
      </AnimatePresence>

      {!isWatchPage && !isAuthPage && <Footer />}
      {!isWatchPage && !isAuthPage && <MobileNav />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
