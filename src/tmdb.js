import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const fetchTrending = async () => {
  const { data } = await tmdbApi.get('/trending/movie/day');
  return data.results;
};

export const fetchTopRated = async () => {
  const { data } = await tmdbApi.get('/movie/top_rated');
  return data.results;
};

export const fetchUpcoming = async () => {
  const { data } = await tmdbApi.get('/movie/upcoming');
  return data.results;
};

export const fetchActionMovies = async () => {
  const { data } = await tmdbApi.get('/discover/movie', {
    params: { with_genres: 28 }, // 28 is Action
  });
  return data.results;
};

export const fetchAnimationMovies = async () => {
  const { data } = await tmdbApi.get('/discover/movie', {
    params: { with_genres: 16 }, // 16 is Animation
  });
  return data.results;
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const fetchDetails = async (type, id) => {
  const { data } = await tmdbApi.get(`/${type}/${id}`);
  return data;
};

export const fetchCredits = async (type, id) => {
  const { data } = await tmdbApi.get(`/${type}/${id}/credits`);
  return data;
};

export const fetchWatchProviders = async (type, id) => {
  const { data } = await tmdbApi.get(`/${type}/${id}/watch/providers`);
  // TMDB providers are usually keyed by country. We will try 'US' by default or just return all results.
  return data.results;
};

export const searchMulti = async (query) => {
  const { data } = await tmdbApi.get('/search/multi', {
    params: { query },
  });
  return data.results;
};

export const fetchSimilar = async (type, id) => {
  const { data } = await tmdbApi.get(`/${type}/${id}/similar`);
  return data.results;
};

export const fetchVideos = async (type, id) => {
  const { data } = await tmdbApi.get(`/${type}/${id}/videos`);
  return data.results;
};

export const fetchKeywords = async (type, id) => {
  const endpoint = type === 'movie' ? 'keywords' : 'keywords';
  const { data } = await tmdbApi.get(`/${type}/${id}/${endpoint}`);
  return data.keywords || data.results || [];
};

export const fetchExternalIds = async (type, id) => {
  const { data } = await tmdbApi.get(`/${type}/${id}/external_ids`);
  return data;
};
