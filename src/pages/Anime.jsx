import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel/Carousel';
import { fetchAnimationMovies, getImageUrl } from '../tmdb';

const Anime = () => {
  const [animeMovies, setAnimeMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const anime = await fetchAnimationMovies();

        const mapMovies = (movies) => movies.slice(0, 10).map(m => ({
          id: m.id,
          title: m.title || m.name,
          releaseYear: (m.release_date || m.first_air_date || '').substring(0, 4),
          imageSrc: getImageUrl(m.poster_path),
        }));

        setAnimeMovies(mapMovies(anime));
      } catch (error) {
        console.error("Failed to fetch Anime", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <h1 style={{ paddingLeft: '4vw', marginBottom: '20px' }}>Anime</h1>
      <Carousel title="Trending Anime" movies={animeMovies} isNumbered={false} />
    </div>
  );
};

export default Anime;
