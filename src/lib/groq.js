// src/lib/groq.js — AI Movie Recommendation via Groq
import axios from 'axios';
import { searchMulti, fetchDetails, getImageUrl } from '../tmdb';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const MOODS = [
  { id: 'feel-good', label: 'Feel Good', icon: 'Smile', desc: 'Uplifting, heartwarming, joyful' },
  { id: 'emotional', label: 'Emotional', icon: 'Heart', desc: 'Deep, moving, tearjerking' },
  { id: 'mind-bending', label: 'Mind-Bending', icon: 'Brain', desc: 'Twists, psychological, mysterious' },
  { id: 'adrenaline', label: 'Adrenaline', icon: 'Flame', desc: 'Action-packed, intense, thrilling' },
  { id: 'chill', label: 'Chill & Cozy', icon: 'Moon', desc: 'Relaxing, lighthearted, easy-watch' },
];

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'Hindi' },
  { id: 'ko', label: 'Korean' },
  { id: 'es', label: 'Spanish' },
  { id: 'ja', label: 'Japanese' },
  { id: 'fr', label: 'French' },
];

const CINEMATIC_POSTERS = [
  'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'https://image.tmdb.org/t/p/w500/qAZ2pzUoIBEYtHBLrJATzFZBkMU.jpg',
  'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDhRkZUHahFXChJ.jpg',
  'https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteR.jpg',
  'https://image.tmdb.org/t/p/w500/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg',
  'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDhRkZUHahFXChJ.jpg',
  'https://image.tmdb.org/t/p/w500/bQS43HSLZzMjZkcHJz4fGc7fNdz.jpg',
  'https://image.tmdb.org/t/p/w500/1X7vow16X7CnCoexXh4H4F2yDJv.jpg',
  'https://image.tmdb.org/t/p/w500/dc8cHlKiMHFMFpLgGLvPMMxpuP.jpg',
  'https://image.tmdb.org/t/p/w500/jJjMFvMRjblDEBMPYlfZECMiXXN.jpg',
  'https://image.tmdb.org/t/p/w500/5RLRm5MfjBEXZhhfgMUfAwQE4vK.jpg',
  'https://image.tmdb.org/t/p/w500/2MxO5YjFBARsJ2pWBcWbGq7gVbY.jpg',
];

export { MOODS, LANGUAGES, CINEMATIC_POSTERS };

export async function getRecommendations({ mood, customText, language }) {
  const moodObj = MOODS.find(m => m.id === mood);
  const langObj = LANGUAGES.find(l => l.id === language);

  const systemPrompt = `You are XAI, an elite AI movie recommendation engine built into Xstream — a premium cinematic streaming platform. You deeply understand cinema, emotions, genres, and what makes a perfect movie-night choice.

Your job: Given the user's mood and preferences, recommend exactly 15 movies that would be the PERFECT fit right now.

CRITICAL RULES:
- Only recommend REAL movies that actually exist. No fake titles.
- Each movie must have a real release year between 2000-2025.
- Prefer movies with rating >= 7.0 on TMDB.
- Match the language preference when possible, but quality matters more.
- "match" percentage should reflect how well the movie fits the mood (80-99%).
- "reason" should be a compelling 1-2 sentence pitch about why this movie is perfect for their current mood. No spoilers.
- Sort by match percentage descending.
- Return exactly 15 movies, no more, no less.

Respond with ONLY valid JSON array, no markdown, no explanation:
[
  {
    "title": "Exact Movie Title",
    "year": 2023,
    "match": 96,
    "reason": "Why this movie is perfect for you right now..."
  },
  ...
]`;

  const userPrompt = `I'm in the mood for: ${moodObj?.label || mood}${customText ? `. More specifically: "${customText}"` : ''}. Preferred language: ${langObj?.label || 'Any'}. Give me 15 movie recommendations.`;

  const { data } = await axios.post(
    GROQ_BASE,
    {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  let parsed;
  try {
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response');
  }

  // Could be array or object with array key
  const movies = Array.isArray(parsed) ? parsed : (parsed.recommendations || parsed.movies || parsed.results || Object.values(parsed).find(Array.isArray));

  if (!Array.isArray(movies) || movies.length === 0) throw new Error('No movies in response');

  // Enrich each recommendation with TMDB data
  const enriched = await Promise.all(
    movies.slice(0, 15).map(async (rec) => {
      try {
        const searchResults = await searchMulti(rec.title);
        const match = searchResults.find(
          (r) => (r.media_type === 'movie' || r.media_type === 'tv') &&
            r.poster_path
        );
        if (!match) {
          return {
            ...rec,
            id: null,
            media_type: 'movie',
            poster: '',
            rating: null,
          };
        }

        // Fetch full details for richer info
        let details = null;
        try {
          details = await fetchDetails(match.media_type, match.id);
        } catch { /* fallback to search result data */ }

        return {
          ...rec,
          id: match.id,
          media_type: match.media_type,
          poster: getImageUrl(match.poster_path, 'w500'),
          backdrop: details?.backdrop_path ? getImageUrl(details.backdrop_path, 'w780') : '',
          rating: details?.vote_average || match.vote_average || null,
          overview: details?.overview || match.overview || rec.reason,
          genres: details?.genres?.map(g => g.name) || [],
          runtime: details?.runtime || null,
        };
      } catch {
        return { ...rec, id: null, media_type: 'movie', poster: '', rating: null };
      }
    })
  );

  return enriched;
}
