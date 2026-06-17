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

// --- New functions for upgraded features ---

export const fetchTrendingTV = async () => {
  const { data } = await tmdbApi.get('/trending/tv/week');
  return data.results;
};

export const fetchTrendingAll = async () => {
  const { data } = await tmdbApi.get('/trending/all/week');
  return data.results;
};

export const fetchNowPlaying = async () => {
  const { data } = await tmdbApi.get('/movie/now_playing');
  return data.results;
};

export const fetchPersonDetails = async (id) => {
  const { data } = await tmdbApi.get(`/person/${id}`, {
    params: { append_to_response: 'movie_credits,tv_credits' }
  });
  return data;
};

export const fetchCompanyDetails = async (id) => {
  const { data } = await tmdbApi.get(`/company/${id}`);
  return data;
};

export const fetchCompanyMovies = async (id) => {
  const { data } = await tmdbApi.get('/discover/movie', {
    params: { with_companies: id, sort_by: 'popularity.desc' }
  });
  return data.results;
};

export const fetchGenreList = async (type = 'movie') => {
  const { data } = await tmdbApi.get(`/genre/${type}/list`);
  return data.genres || [];
};

export const fetchDiscoverByGenre = async (type, genreId, page = 1) => {
  const { data } = await tmdbApi.get(`/discover/${type}`, {
    params: { with_genres: genreId, sort_by: 'popularity.desc', page }
  });
  return data;
};

export const fetchCollection = async (id) => {
  const { data } = await tmdbApi.get(`/collection/${id}`);
  return data;
};

export const searchMultiPaginated = async (query, page = 1) => {
  const { data } = await tmdbApi.get('/search/multi', {
    params: { query, page }
  });
  return data;
};

export const fetchDetailsFull = async (type, id) => {
  const appendStr = type === 'movie'
    ? 'credits,videos,images,reviews,keywords,release_dates,watch/providers'
    : 'credits,videos,images,reviews,keywords,content_ratings,watch/providers';
  const { data } = await tmdbApi.get(`/${type}/${id}`, {
    params: { append_to_response: appendStr }
  });
  return data;
};
