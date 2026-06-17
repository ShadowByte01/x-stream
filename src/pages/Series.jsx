import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchGenreList, fetchDiscoverByGenre, getImageUrl } from '../tmdb';
import Carousel from '../components/Carousel/Carousel';
import MovieCard from '../components/MovieCard/MovieCard';
import axios from 'axios';

const Series = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreShows, setGenreShows] = useState([]);
  const [genreLoading, setGenreLoading] = useState(false);
  const [popularSeries, setPopularSeries] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const tmdbApi = axios.create({ baseURL: 'https://api.themoviedb.org/3', params: { api_key: TMDB_API_KEY } });
        const [genreList, popular, topRated] = await Promise.all([
          fetchGenreList('tv'),
          tmdbApi.get('/tv/popular'),
          tmdbApi.get('/tv/top_rated'),
        ]);
        setGenres(genreList);
        const mapMovies = (movies) => movies.slice(0, 15).map(m => ({
          id: m.id, title: m.name,
          releaseYear: (m.first_air_date || '').substring(0, 4),
          media_type: 'tv', imageSrc: getImageUrl(m.poster_path), rating: m.vote_average || 0,
        }));
        setPopularSeries(mapMovies(popular.data.results));
        setTopRatedSeries(mapMovies(topRated.data.results));
      } catch (err) { console.error(err); }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedGenre) { setGenreShows([]); return; }
    const fetchByGenre = async () => {
      setGenreLoading(true);
      try {
        const data = await fetchDiscoverByGenre('tv', selectedGenre, 1);
        setGenreShows((data.results || []).filter(m => m.poster_path));
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
      <h1 style={{ paddingLeft: '4vw', marginBottom: '10px', fontSize: '2rem', fontWeight: 900 }}>TV Series</h1>
      
      <div style={{ padding: '0 4vw', marginBottom: '1.5rem', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <button onClick={() => setSelectedGenre(null)} style={{
          padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)',
          background: !selectedGenre ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
          color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap',
        }}>All</button>
        {genres.map(g => (
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
              {genreShows.map(m => (
                <MovieCard key={m.id} id={m.id} title={m.name || m.title} imageSrc={getImageUrl(m.poster_path)}
                  media_type="tv" releaseYear={(m.first_air_date || '').substring(0, 4)} rating={m.vote_average} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <Carousel title="🔥 Popular Series" movies={popularSeries} isNumbered={false} />
          <Carousel title="⭐ Top Rated Series" movies={topRatedSeries} isNumbered={false} />
        </>
      )}
    </motion.div>
  );
};

export default Series;
