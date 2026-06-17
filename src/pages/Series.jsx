import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel/Carousel';
import { getImageUrl } from '../tmdb';
import axios from 'axios';

const Series = () => {
  const [popularSeries, setPopularSeries] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const tmdbApi = axios.create({
          baseURL: 'https://api.themoviedb.org/3',
          params: { api_key: TMDB_API_KEY },
        });

        const popular = await tmdbApi.get('/tv/popular');
        const topRated = await tmdbApi.get('/tv/top_rated');

        const mapMovies = (movies) => movies.slice(0, 10).map(m => ({
          id: m.id,
          title: m.name,
          releaseYear: (m.first_air_date || '').substring(0, 4),
          media_type: 'tv',
          imageSrc: getImageUrl(m.poster_path),
        }));

        setPopularSeries(mapMovies(popular.data.results));
        setTopRatedSeries(mapMovies(topRated.data.results));
      } catch (error) {
        console.error("Failed to fetch Series", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <h1 style={{ paddingLeft: '4vw', marginBottom: '20px' }}>TV Series</h1>
      <Carousel title="Popular Series" movies={popularSeries} isNumbered={false} />
      <Carousel title="Top Rated Series" movies={topRatedSeries} isNumbered={false} />
    </div>
  );
};

export default Series;
