import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import Carousel from '../components/Carousel/Carousel';
import { fetchTrending, fetchTopRated, fetchUpcoming, fetchAnimationMovies, fetchTrendingTV, fetchNowPlaying, fetchActionMovies, getImageUrl } from '../tmdb';
import { Flame, Star, Tv, Clapperboard, Zap, Calendar, Sparkles } from 'lucide-react';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, topRated, upcoming, animation, tv, nowPlay, action] = await Promise.all([
          fetchTrending(),
          fetchTopRated(),
          fetchUpcoming(),
          fetchAnimationMovies(),
          fetchTrendingTV().catch(() => []),
          fetchNowPlaying().catch(() => []),
          fetchActionMovies().catch(() => []),
        ]);

        const mapMovies = (movies, defaultType = 'movie') => movies.slice(0, 15).map(m => ({
          id: m.id,
          title: m.title || m.name,
          releaseYear: (m.release_date || m.first_air_date || '').substring(0, 4),
          imageSrc: getImageUrl(m.poster_path),
          backdropSrc: getImageUrl(m.backdrop_path, 'original'),
          description: m.overview,
          rating: m.vote_average || 0,
          media_type: m.media_type || defaultType,
        }));

        setTrendingMovies(mapMovies(trending));
        setTopRatedMovies(mapMovies(topRated));
        setUpcomingMovies(mapMovies(upcoming));
        setAnimationMovies(mapMovies(animation));
        setTrendingTV(mapMovies(tv, 'tv'));
        setNowPlaying(mapMovies(nowPlay));
        setActionMovies(mapMovies(action));
      } catch (error) {
        console.error("Failed to fetch movies from TMDB.", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {trendingMovies.length > 0 && (
        <Hero movies={trendingMovies.slice(0, 5)} />
      )}

      <div style={{ marginTop: '-10vh', paddingBottom: '10vh' }}>
        <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Flame size={24} color="#f97316"/> Trending Today</span>} movies={trendingMovies} isNumbered={true} />
        <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={24} color="#eab308"/> Top Rated Movies</span>} movies={topRatedMovies} isNumbered={true} />
        {trendingTV.length > 0 && (
          <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tv size={24} color="#3b82f6"/> Trending TV Shows</span>} movies={trendingTV} isNumbered={false} />
        )}
        {nowPlaying.length > 0 && (
          <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clapperboard size={24} color="#ef4444"/> Now Playing in Theaters</span>} movies={nowPlaying} isNumbered={false} />
        )}
        {actionMovies.length > 0 && (
          <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={24} color="#eab308"/> Action Movies</span>} movies={actionMovies} isNumbered={false} />
        )}
        <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={24} color="#8b5cf6"/> Upcoming Releases</span>} movies={upcomingMovies} isNumbered={false} />
        <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={24} color="#f43f5e"/> Trending Animation</span>} movies={animationMovies} isNumbered={false} />
      </div>
    </>
  );
};

export default Home;
