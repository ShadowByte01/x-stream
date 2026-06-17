import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel/Carousel';
import { fetchUpcoming, fetchTrending, getImageUrl } from '../tmdb';

const NewPopular = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const up = await fetchUpcoming();
        const tr = await fetchTrending();

        const mapMovies = (movies) => movies.slice(0, 10).map(m => ({
          id: m.id,
          title: m.title || m.name,
          releaseYear: (m.release_date || m.first_air_date || '').substring(0, 4),
          imageSrc: getImageUrl(m.poster_path),
        }));

        setUpcoming(mapMovies(up));
        setTrending(mapMovies(tr));
      } catch (error) {
        console.error("Failed to fetch New & Popular", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <h1 style={{ paddingLeft: '4vw', marginBottom: '20px' }}>New & Popular</h1>
      <Carousel title="Trending Right Now" movies={trending} isNumbered={true} />
      <Carousel title="Coming Soon" movies={upcoming} isNumbered={false} />
    </div>
  );
};

export default NewPopular;
