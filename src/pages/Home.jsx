import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import Carousel from '../components/Carousel/Carousel';
import { fetchTrending, fetchTopRated, fetchUpcoming, fetchAnimationMovies, fetchTrendingTV, fetchNowPlaying, fetchActionMovies, getImageUrl } from '../tmdb';
import { Flame, Star, Tv, Clapperboard, Zap, Calendar, Sparkles, Clock, Crown, ListPlus } from 'lucide-react';
import { useHistory, useMostViewedList, useWatchlist } from '../lib/useStore';
import { removeFromHistory } from '../lib/storage';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);

  const history = useHistory();
  const mostViewed = useMostViewedList(10);
  const watchlist = useWatchlist();

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

        const mapMovies = (movies, defaultType = 'movie') =>
          movies.slice(0, 15).map((m) => ({
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
        console.error('Failed to fetch movies from TMDB.', error);
      }
    };

    fetchData();
  }, []);

  // Continue Watching — items with a poster (recently watched or in-progress)
  const continueWatching = history
    .filter((h) => h.imageSrc || h.poster_path)
    .map((h) => ({
      id: h.id,
      title: h.title,
      imageSrc: h.imageSrc || getImageUrl(h.poster_path),
      releaseYear: h.releaseYear,
      rating: h.rating,
      progress: h.progress,
      media_type: h.media_type,
    }));

  const myListRow = watchlist
    .filter((w) => w.imageSrc || w.poster_path)
    .map((w) => ({
      id: w.id,
      title: w.title,
      imageSrc: w.imageSrc || getImageUrl(w.poster_path),
      releaseYear: w.releaseYear,
      rating: w.rating,
      media_type: w.media_type,
    }));

  const mostViewedRow = mostViewed
    .filter((m) => m.imageSrc || m.poster_path)
    .map((m, i) => ({
      id: m.id,
      title: m.title,
      imageSrc: m.imageSrc || getImageUrl(m.poster_path),
      releaseYear: m.releaseYear,
      rating: m.rating,
      media_type: m.media_type,
      isMostViewed: i === 0,
    }));

  return (
    <>
      {trendingMovies.length > 0 && <Hero movies={trendingMovies.slice(0, 5)} />}

      <div className="home-content">
        {continueWatching.length > 0 && (
          <Carousel
            title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={24} color="#22d3ee" /> Continue Watching</span>}
            movies={continueWatching}
            onRemove={(id, mt) => removeFromHistory(id, mt)}
          />
        )}

        {mostViewedRow.length > 0 && (
          <Carousel
            title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Crown size={24} color="#f59e0b" /> Most Viewed on Xstream</span>}
            movies={mostViewedRow}
          />
        )}

        <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Flame size={24} color="#f97316" /> Trending Today</span>} movies={trendingMovies} isNumbered={true} />

        {myListRow.length > 0 && (
          <Carousel
            title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ListPlus size={24} color="#ec4899" /> My List</span>}
            movies={myListRow}
          />
        )}

        <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={24} color="#eab308" /> Top Rated Movies</span>} movies={topRatedMovies} isNumbered={true} />

        {trendingTV.length > 0 && (
          <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tv size={24} color="#3b82f6" /> Trending TV Shows</span>} movies={trendingTV} isNumbered={false} />
        )}
        {nowPlaying.length > 0 && (
          <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clapperboard size={24} color="#ef4444" /> Now Playing in Theaters</span>} movies={nowPlaying} isNumbered={false} />
        )}
        {actionMovies.length > 0 && (
          <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={24} color="#eab308" /> Action Movies</span>} movies={actionMovies} isNumbered={false} />
        )}
        <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={24} color="#8b5cf6" /> Upcoming Releases</span>} movies={upcomingMovies} isNumbered={false} />
        <Carousel title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={24} color="#f43f5e" /> Trending Animation</span>} movies={animationMovies} isNumbered={false} />
      </div>
    </>
  );
};

export default Home;
