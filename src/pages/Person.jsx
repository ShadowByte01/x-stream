import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPersonDetails, getImageUrl } from '../tmdb';
import { User, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './Person.css';

const Person = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getData = async () => {
      setLoading(true);
      try {
        const data = await fetchPersonDetails(id);
        setPerson(data);
      } catch (e) {
        console.error("Failed to fetch person", e);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  if (loading) return (
    <div className="person-loading">
      <div className="loading-spinner"></div>
    </div>
  );

  if (!person) return <div className="person-error">Person not found.</div>;

  const knownFor = [...(person.movie_credits?.cast || []), ...(person.tv_credits?.cast || [])]
    .filter(m => m.poster_path)
    .sort((a, b) => b.popularity - a.popularity)
    .reduce((acc, current) => {
      if (!acc.find(item => item.id === current.id)) acc.push(current);
      return acc;
    }, [])
    .slice(0, 20);

  return (
    <motion.div 
      className="person-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button className="person-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="person-layout">
        {/* Sidebar */}
        <div className="person-sidebar">
          <div className="person-photo-wrap">
            {person.profile_path ? (
              <LazyLoadImage 
                src={getImageUrl(person.profile_path, 'w500')} 
                alt={person.name} 
                effect="blur"
                className="person-photo" 
              />
            ) : (
              <div className="person-photo-placeholder"><User size={60} /></div>
            )}
          </div>
          
          <h2 className="person-section-title">Personal Info</h2>
          <div className="person-info-list">
            {person.known_for_department && (
              <div className="person-info-item">
                <strong>Known For</strong>
                <span>{person.known_for_department}</span>
              </div>
            )}
            {person.gender && (
              <div className="person-info-item">
                <strong>Gender</strong>
                <span>{person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Other'}</span>
              </div>
            )}
            {person.birthday && (
              <div className="person-info-item">
                <strong><Calendar size={14} /> Birthday</strong>
                <span>{person.birthday}</span>
              </div>
            )}
            {person.place_of_birth && (
              <div className="person-info-item">
                <strong><MapPin size={14} /> Place of Birth</strong>
                <span>{person.place_of_birth}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="person-main">
          <h1 className="person-name">{person.name}</h1>
          
          {person.biography && (
            <div className="person-bio-section">
              <h3>Biography</h3>
              <p className="person-biography">{person.biography}</p>
            </div>
          )}

          {knownFor.length > 0 && (
            <div className="person-filmography">
              <h3>Known For</h3>
              <div className="person-films-grid">
                {knownFor.map(movie => (
                  <motion.div 
                    key={movie.id} 
                    className="person-film-card"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/details/${movie.media_type || 'movie'}/${movie.id}`)}
                  >
                    <div className="person-film-poster">
                      <LazyLoadImage
                        src={getImageUrl(movie.poster_path, 'w342')}
                        alt={movie.title || movie.name}
                        effect="blur"
                        className="person-film-img"
                      />
                    </div>
                    <h4>{movie.title || movie.name}</h4>
                    <p className="person-film-character">{movie.character}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Person;
