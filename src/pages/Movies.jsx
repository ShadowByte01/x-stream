import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { fetchGenreList, fetchDiscoverByGenre, fetchTopRated, fetchActionMovies, getImageUrl } from '../tmdb';
import Carousel from '../components/Carousel/Carousel';
import MovieCard from '../components/MovieCard/MovieCard';

const Movies = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  const [genreLoading, setGenreLoading] = useState(false);
  const [topMovies, setTopMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const [genreList, top, action] = await Promise.all([
          fetchGenreList('movie'),
          fetchTopRated(),
          fetchActionMovies(),
        ]);
        setGenres(genreList);
        const mapMovies = (movies) => movies.slice(0, 15).map(m => ({
          id: m.id, title: m.title || m.name,
          releaseYear: (m.release_date || m.first_air_date || '').substring(0, 4),
          imageSrc: getImageUrl(m.poster_path), rating: m.vote_average || 0,
        }));
        setTopMovies(mapMovies(top));
        setActionMovies(mapMovies(action));
      } catch (err) { console.error(err); }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedGenre) { setGenreMovies([]); return; }
    const fetchByGenre = async () => {
      setGenreLoading(true);
      try {
        const data = await fetchDiscoverByGenre('movie', selectedGenre, 1);
        setGenreMovies((data.results || []).filter(m => m.poster_path));
      } catch (e) { console.error(e); }
      finally { setGenreLoading(false); }
    };
    fetchByGenre();
  }, [selectedGenre]);

  return (
    <motion.div 
      className="page-container" 
      style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
    >
      <h1 style={{ paddingLeft: '4vw', marginBottom: '10px', fontSize: '2rem', fontWeight: 900 }}>Movies</h1>
      
      {/* Genre Filter */}
      <div style={{ padding: '0 4vw', marginBottom: '1.5rem', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedGenre(null)}
          style={{
            padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)',
            background: !selectedGenre ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
            color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            whiteSpace: 'nowrap', transition: 'all 0.2s',
          }}
        >All</button>
        {genres.map(g => (
          <button
            key={g.id}
            onClick={() => setSelectedGenre(g.id)}
            style={{
              padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)',
              background: selectedGenre === g.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
              color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >{g.name}</button>
        ))}
      </div>

      {/* Genre results grid or default carousels */}
      {selectedGenre ? (
        <div style={{ padding: '0 4vw' }}>
          {genreLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="loading-spinner" style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1.2rem' }}>
              {genreMovies.map(m => (
                <MovieCard 
                  key={m.id} id={m.id} title={m.title || m.name}
                  imageSrc={getImageUrl(m.poster_path)} media_type="movie"
                  releaseYear={(m.release_date || '').substring(0, 4)}
                  rating={m.vote_average}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Trophy size={24} color="#eab308"/> Critically Acclaimed</span>} movies={topMovies} isNumbered={true} />
          <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={24} color="#f97316"/> Action Blockbusters</span>} movies={actionMovies} isNumbered={false} />
        </>
      )}
    </motion.div>
  );
};

export default Movies;
