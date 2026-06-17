import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import Carousel from '../components/Carousel/Carousel';
import { fetchTrending, fetchTopRated, fetchUpcoming, fetchAnimationMovies, getImageUrl } from '../tmdb';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await fetchTrending();
        const topRated = await fetchTopRated();
        const upcoming = await fetchUpcoming();
        const animation = await fetchAnimationMovies();

        const mapMovies = (movies) => movies.slice(0, 10).map(m => ({
          id: m.id,
          title: m.title || m.name,
          releaseYear: (m.release_date || m.first_air_date || '').substring(0, 4),
          imageSrc: getImageUrl(m.poster_path),
          backdropSrc: getImageUrl(m.backdrop_path, 'original'),
          description: m.overview
        }));

        setTrendingMovies(mapMovies(trending));
        setTopRatedMovies(mapMovies(topRated));
        setUpcomingMovies(mapMovies(upcoming));
        setAnimationMovies(mapMovies(animation));
      } catch (error) {
        console.error("Failed to fetch movies from TMDB.", error);
        const fallbackPoster = 'https://placehold.co/400x600/111111/888888?text=Movie+Not\\nAvailable\\n(Loading...)';
        const fallbackHero = 'https://placehold.co/1920x1080/111111/888888?text=Data+Not+Available\\nPlease+Add+TMDB+API+Key';

        const fallbackMovies = Array(10).fill({ 
          id: Math.random(), 
          imageSrc: fallbackPoster, 
          backdropSrc: fallbackHero,
          title: 'WAITING FOR DATA',
          description: 'Movies are currently not available. Please configure your TMDB API key to load real data.'
        });

        setTrendingMovies(fallbackMovies);
        setTopRatedMovies(fallbackMovies);
        setUpcomingMovies(fallbackMovies);
        setAnimationMovies(fallbackMovies);
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
        <Carousel title="Trending Today" movies={trendingMovies} isNumbered={true} />
        <Carousel title="Top Rated Movies" movies={topRatedMovies} isNumbered={true} />
        <Carousel title="Upcoming Releases" movies={upcomingMovies} isNumbered={false} />
        <Carousel title="Trending Animation" movies={animationMovies} isNumbered={false} />
      </div>
    </>
  );
};

export default Home;
