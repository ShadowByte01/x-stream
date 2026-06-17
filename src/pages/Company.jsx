import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCompanyDetails, fetchCompanyMovies, getImageUrl } from '../tmdb';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './Company.css';

const Company = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getData = async () => {
      setLoading(true);
      try {
        const [compData, movData] = await Promise.all([
          fetchCompanyDetails(id),
          fetchCompanyMovies(id),
        ]);
        setCompany(compData);
        setMovies(movData || []);
      } catch (e) {
        console.error("Failed to fetch company", e);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  if (loading) return <div className="company-loading"><div className="loading-spinner"></div></div>;
  if (!company) return <div className="company-error">Company not found.</div>;

  return (
    <motion.div 
      className="company-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button className="company-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="company-header">
        {company.logo_path ? (
          <div className="company-logo-box">
            <img src={getImageUrl(company.logo_path, 'w500')} alt={company.name} className="company-logo" />
          </div>
        ) : (
          <div className="company-logo-box no-logo">
            <span>{company.name}</span>
          </div>
        )}
        <div className="company-info">
          <h1 className="company-name">{company.name}</h1>
          <span className="company-label">Production Studio</span>
          {company.headquarters && <p className="company-hq"><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {company.headquarters}</p>}
          {company.homepage && (
            <a href={company.homepage} target="_blank" rel="noreferrer" className="company-link">
              Visit Official Website <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <h2 className="company-section-title">Produced by {company.name}</h2>
      {movies.length > 0 ? (
        <div className="company-grid">
          {movies.filter(m => m.poster_path).map(movie => (
            <motion.div
              key={movie.id}
              className="company-movie-card"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/details/movie/${movie.id}`)}
            >
              <LazyLoadImage
                src={getImageUrl(movie.poster_path, 'w342')}
                alt={movie.title}
                effect="blur"
                className="company-movie-img"
              />
              <div className="company-movie-overlay">
                <p className="company-movie-title">{movie.title}</p>
                {movie.release_date && <p className="company-movie-year">{movie.release_date.substring(0, 4)}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#888' }}>No movies found for this studio.</p>
      )}
    </motion.div>
  );
};

export default Company;
