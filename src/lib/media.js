// src/lib/media.js — small helpers for normalizing TMDB payloads.
import { getImageUrl } from '../tmdb';

export function getMediaType(item) {
  if (item?.media_type) return item.media_type === 'person' ? 'movie' : item.media_type;
  if (item?.title) return 'movie';
  if (item?.name) return 'tv';
  return 'movie';
}

export function titleOf(item) {
  return item?.title || item?.name || item?.original_name || 'Untitled';
}

export function yearOf(item) {
  return (item?.release_date || item?.first_air_date || '').substring(0, 4);
}

export function posterOf(item, size = 'w500') {
  return getImageUrl(item?.poster_path, size);
}

export function backdropOf(item, size = 'original') {
  return getImageUrl(item?.backdrop_path, size);
}

export function toCard(item, defaultType) {
  return {
    id: item.id,
    title: titleOf(item),
    releaseYear: yearOf(item),
    imageSrc: posterOf(item),
    backdropSrc: backdropOf(item),
    overview: item.overview,
    rating: item.vote_average || 0,
    media_type: item.media_type || defaultType || getMediaType(item),
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
  };
}
