import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMulti, getImageUrl } from '../tmdb';
import MovieCard from '../components/MovieCard/MovieCard';

const Search = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setIsLoading(true);
        try {
          const data = await searchMulti(query);
          // Filter only movies and tv shows with images
          const filtered = data
            .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
            .map(item => ({
              id: item.id,
              media_type: item.media_type,
              title: item.title || item.name,
              releaseYear: (item.release_date || item.first_air_date || '').substring(0, 4),
              imageSrc: getImageUrl(item.poster_path),
            }));
          setResults(filtered);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="page-container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <h1 style={{ paddingLeft: '4vw', marginBottom: '20px' }}>
        {query ? `Search Results for "${query}"` : 'Search'}
      </h1>
      
      {isLoading ? (
        <div style={{ paddingLeft: '4vw', color: '#888' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '0 4vw' }}>
          {results.length > 0 ? (
            results.map((movie, index) => (
              <div key={index} style={{ width: '200px' }}>
                <MovieCard 
                  imageSrc={movie.imageSrc} 
                  title={movie.title} 
                  id={movie.id}
                  media_type={movie.media_type}
                />
              </div>
            ))
          ) : (
            query && <div style={{ color: '#888' }}>No results found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
