import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { fetchGenreList, fetchDiscoverByGenre, fetchAnimationMovies, getImageUrl } from '../tmdb';
import Carousel from '../components/Carousel/Carousel';
import MovieCard from '../components/MovieCard/MovieCard';

const Anime = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  const [genreLoading, setGenreLoading] = useState(false);
  const [animeMovies, setAnimeMovies] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const [genreList, anime] = await Promise.all([
          fetchGenreList('movie'),
          fetchAnimationMovies(),
        ]);
        setGenres(genreList);
        const mapMovies = (movies) => movies.slice(0, 15).map(m => ({
          id: m.id, title: m.title || m.name,
          releaseYear: (m.release_date || m.first_air_date || '').substring(0, 4),
          imageSrc: getImageUrl(m.poster_path), rating: m.vote_average || 0,
        }));
        setAnimeMovies(mapMovies(anime));
      } catch (err) { console.error(err); }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedGenre) { setGenreMovies([]); return; }
    const fetchByGenre = async () => {
      setGenreLoading(true);
      try {
        // Animation genre (16) + selected genre
        const data = await fetchDiscoverByGenre('movie', `16,${selectedGenre}`, 1);
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
      <h1 style={{ paddingLeft: '4vw', marginBottom: '10px', fontSize: '2rem', fontWeight: 900 }}>Anime</h1>
      
      <div style={{ padding: '0 4vw', marginBottom: '1.5rem', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <button onClick={() => setSelectedGenre(null)} style={{
          padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)',
          background: !selectedGenre ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
          color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap',
        }}>All</button>
        {genres.filter(g => [28, 12, 35, 18, 10751, 14, 878, 53].includes(g.id)).map(g => (
          <button key={g.id} onClick={() => setSelectedGenre(g.id)} style={{
            padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)',
            background: selectedGenre === g.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
            color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap',
          }}>{g.name}</button>
        ))}
      </div>

      {selectedGenre ? (
        <div style={{ padding: '0 4vw' }}>
          {genreLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1.2rem' }}>
              {genreMovies.map(m => (
                <MovieCard key={m.id} id={m.id} title={m.title || m.name} imageSrc={getImageUrl(m.poster_path)}
                  media_type="movie" releaseYear={(m.release_date || '').substring(0, 4)} rating={m.vote_average} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={24} color="#f43f5e"/> Trending Anime</span>} movies={animeMovies} isNumbered={false} />
      )}
    </motion.div>
  );
};

export default Anime;
