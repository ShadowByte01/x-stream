import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel/Carousel';
import { fetchTopRated, fetchActionMovies, getImageUrl } from '../tmdb';

const Movies = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const top = await fetchTopRated();
        const action = await fetchActionMovies();

        const mapMovies = (movies) => movies.slice(0, 10).map(m => ({
          id: m.id,
          title: m.title,
          releaseYear: (m.release_date || m.first_air_date || '').substring(0, 4),
          imageSrc: getImageUrl(m.poster_path),
        }));

        setTopMovies(mapMovies(top));
        setActionMovies(mapMovies(action));
      } catch (error) {
        console.error("Failed to fetch Movies", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <h1 style={{ paddingLeft: '4vw', marginBottom: '20px' }}>Movies</h1>
      <Carousel title="Critically Acclaimed" movies={topMovies} isNumbered={true} />
      <Carousel title="Action Blockbusters" movies={actionMovies} isNumbered={false} />
    </div>
  );
};

export default Movies;
