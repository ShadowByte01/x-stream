import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Carousel from '../components/Carousel/Carousel';
import { fetchUpcoming, fetchTrending, fetchTrendingAll, fetchNowPlaying, getImageUrl } from '../tmdb';

const NewPopular = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);
  const [trendingAll, setTrendingAll] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [up, tr, all, np] = await Promise.all([
          fetchUpcoming(),
          fetchTrending(),
          fetchTrendingAll().catch(() => []),
          fetchNowPlaying().catch(() => []),
        ]);

        const mapMovies = (movies, defaultType = 'movie') => movies.slice(0, 15).map(m => ({
          id: m.id,
          title: m.title || m.name,
          releaseYear: (m.release_date || m.first_air_date || '').substring(0, 4),
          imageSrc: getImageUrl(m.poster_path),
          rating: m.vote_average || 0,
          media_type: m.media_type || defaultType,
        }));

        setUpcoming(mapMovies(up));
        setTrending(mapMovies(tr));
        setTrendingAll(mapMovies(all));
        setNowPlaying(mapMovies(np));
      } catch (error) {
        console.error("Failed to fetch New & Popular", error);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div 
      className="page-container" 
      style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
    >
      <h1 style={{ paddingLeft: '4vw', marginBottom: '10px', fontSize: '2rem', fontWeight: 900 }}>New & Popular</h1>
      <Carousel title="🔥 Trending Right Now" movies={trending} isNumbered={true} />
      {trendingAll.length > 0 && <Carousel title="🌎 Trending Worldwide" movies={trendingAll} isNumbered={false} />}
      {nowPlaying.length > 0 && <Carousel title="🎬 In Theaters Now" movies={nowPlaying} isNumbered={false} />}
      <Carousel title="📅 Coming Soon" movies={upcoming} isNumbered={false} />
    </motion.div>
  );
};

export default NewPopular;
