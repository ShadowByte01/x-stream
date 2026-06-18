import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import MobileNav from './components/MobileNav/MobileNav';
import ConsentBanner from './components/ConsentBanner/ConsentBanner';
import Home from './pages/Home';
import Series from './pages/Series';
import Movies from './pages/Movies';
import Anime from './pages/Anime';
import NewPopular from './pages/NewPopular';
import Search from './pages/Search';
import Details from './pages/Details';
import Watch from './pages/Watch';
import Profile from './pages/Profile';
import Person from './pages/Person';
import Company from './pages/Company';
import IntroSplash from './components/IntroSplash/IntroSplash';
import * as store from './lib/storage';

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const prefs = store.getPrefs();
    if (prefs.hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    store.setPref('hasSeenIntro', true);
  };

  // Apply saved accent color + keep --accent-rgb in sync
  useEffect(() => {
    const applyAccent = (hex) => {
      const rgb = hexToRgb(hex) || [229, 9, 20];
      document.documentElement.style.setProperty('--accent-color', hex);
      document.documentElement.style.setProperty('--accent-rgb', rgb.join(' '));
    };
    const prefs = store.getPrefs();
    applyAccent(prefs.accentColor || '#E50914');
    const unsub = store.subscribe(() => {
      const p = store.getPrefs();
      applyAccent(p.accentColor || '#E50914');
    });
    return unsub;
  }, []);

  const isWatchPage = location.pathname.startsWith('/watch');

  return (
    <div className="app-container">
      {showIntro && <IntroSplash onComplete={handleIntroComplete} />}
      <ConsentBanner />
      {!isWatchPage && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
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

      {!isWatchPage && <Footer />}
      {!isWatchPage && <MobileNav />}
    </div>
  );
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function App() {
  return <AppContent />;
}

export default App;
