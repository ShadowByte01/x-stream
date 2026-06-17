import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
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

  const location = useLocation();
  const isWatchPage = location.pathname.startsWith('/watch');
  const isAuthPage = location.pathname.startsWith('/login');

  return (
    <div className="app-container">
      {showIntro && <IntroSplash onComplete={handleIntroComplete} />}
      {!isWatchPage && !isAuthPage && <Navbar />}
      
      <Routes>
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
      </Routes>

      {!isWatchPage && !isAuthPage && <Footer />}
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
