import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchMultiPaginated, getImageUrl } from '../tmdb';
import { Search as SearchIcon, Filter, Loader2 } from 'lucide-react';
import MovieCard from '../components/MovieCard/MovieCard';

const Search = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all', 'movie', 'tv'
  const loadMoreRef = useRef(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q');

  const fetchResults = useCallback(async (pageNum, append = false) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const data = await searchMultiPaginated(query, pageNum);
      const filtered = (data.results || [])
        .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
        .map(item => ({
          id: item.id,
          media_type: item.media_type,
          title: item.title || item.name,
          releaseYear: (item.release_date || item.first_air_date || '').substring(0, 4),
          imageSrc: getImageUrl(item.poster_path),
          rating: item.vote_average || 0,
        }));
      
      if (append) {
        setResults(prev => {
          const ids = new Set(prev.map(r => r.id));
          return [...prev, ...filtered.filter(r => !ids.has(r.id))];
        });
      } else {
        setResults(filtered);
      }
      setTotalPages(data.total_pages || 0);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    setPage(1);
    setResults([]);
    fetchResults(1, false);
  }, [query, fetchResults]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && page < totalPages) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchResults(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [isLoading, page, totalPages, fetchResults]);

  const filteredResults = mediaFilter === 'all' 
    ? results 
    : results.filter(r => r.media_type === mediaFilter);

  return (
    <motion.div 
      className="page-container" 
      style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
    >
      <h1 style={{ paddingLeft: '4vw', marginBottom: '8px', fontSize: '2rem', fontWeight: 900 }}>
        {query ? `Results for "${query}"` : 'Search'}
      </h1>
      
      {query && (
        <div style={{ paddingLeft: '4vw', marginBottom: '1.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Filter size={16} style={{ color: '#888' }} />
          {['all', 'movie', 'tv'].map(f => (
            <button
              key={f}
              onClick={() => setMediaFilter(f)}
              style={{
                padding: '5px 14px', borderRadius: '20px', 
                border: '1px solid rgba(255,255,255,0.15)',
                background: mediaFilter === f ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                textTransform: 'capitalize', transition: 'all 0.2s',
              }}
            >{f === 'all' ? 'All' : f === 'movie' ? 'Movies' : 'TV Shows'}</button>
          ))}
          <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: '8px' }}>
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      {filteredResults.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', 
          gap: '1.2rem', 
          padding: '0 4vw' 
        }}>
          {filteredResults.map((movie) => (
            <motion.div 
              key={`${movie.media_type}-${movie.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard 
                imageSrc={movie.imageSrc} 
                title={movie.title} 
                id={movie.id}
                media_type={movie.media_type}
                releaseYear={movie.releaseYear}
                rating={movie.rating}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        !isLoading && query && (
          <div style={{ padding: '3rem 4vw', textAlign: 'center' }}>
            <SearchIcon size={48} style={{ color: '#333', marginBottom: '1rem' }} />
            <p style={{ color: '#888', fontSize: '1.1rem' }}>No results found for "{query}"</p>
            <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.5rem' }}>Try a different search term</p>
          </div>
        )
      )}
      
      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} style={{ height: 1 }} />
      
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader2 size={30} style={{ color: 'var(--accent-color)', animation: 'spin 1s linear infinite' }} />
        </div>
      )}
    </motion.div>
  );
};

export default Search;
