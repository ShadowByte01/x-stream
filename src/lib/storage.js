// src/lib/storage.js
// Cookie + localStorage "account" layer for Xstream.
// NO backend, NO sign-in. All personalization lives in the browser,
// gated behind a cookie-consent banner (Accept / Decline).

const PREFIX = 'xs_';
const CONSENT_KEY = 'consent';
const CONSENT_COOKIE = 'xs_consent';
const VISITOR_COOKIE = 'xs_visitor';

const ONE_YEAR_DAYS = 365;

/* ----------------------------- tiny helpers ----------------------------- */

function safeGetLS(key) {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLS(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
    window.dispatchEvent(new CustomEvent('xs-storage', { detail: { key } }));
  } catch {
    /* ignore quota / privacy errors */
  }
}

function read(key, fallback) {
  const raw = safeGetLS(PREFIX + key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  safeSetLS(PREFIX + key, JSON.stringify(value));
}

/* ------------------------------- cookies -------------------------------- */

function setCookie(name, value, days) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // SameSite=Lax keeps it working across normal navigation; Secure where available.
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ------------------------------- consent -------------------------------- */

// consent is stored both in a cookie (so it survives reloads / is "cookie based"
// as requested) and mirrored to localStorage so React can subscribe to it.
export function getConsent() {
  const cookie = getCookie(CONSENT_COOKIE);
  if (cookie === 'accepted' || cookie === 'declined') return cookie;
  const ls = read(CONSENT_KEY, null);
  return ls && ls.choice ? ls.choice : null;
}

export function getConsentDate() {
  const ls = read(CONSENT_KEY, null);
  return ls && ls.acceptedAt ? new Date(ls.acceptedAt) : null;
}

export function acceptConsent() {
  const now = Date.now();
  setCookie(CONSENT_COOKIE, 'accepted', ONE_YEAR_DAYS);
  write(CONSENT_KEY, { choice: 'accepted', acceptedAt: now });
  ensureVisitor();
}

export function declineConsent() {
  const now = Date.now();
  setCookie(CONSENT_COOKIE, 'declined', ONE_YEAR_DAYS);
  write(CONSENT_KEY, { choice: 'declined', acceptedAt: now });
  // wipe any previously stored personalization
  wipeAllPersonalData();
}

// True only when the user has explicitly accepted.
export function isPersonalizationAllowed() {
  return getConsent() === 'accepted';
}

/* ------------------------------ visitor id ------------------------------ */

export function ensureVisitor() {
  let id = getCookie(VISITOR_COOKIE);
  if (!id) {
    id = uuid();
    setCookie(VISITOR_COOKIE, id, ONE_YEAR_DAYS);
  }
  return id;
}

export function getVisitorId() {
  return getCookie(VISITOR_COOKIE) || null;
}

/* --------------------------- personalization ---------------------------- */
/* Every write is a no-op if consent was not accepted.                     */

function guardedWrite(key, value) {
  if (!isPersonalizationAllowed()) return;
  write(key, value);
}

/* ---- watch history (with resume progress) ---- */

export function getHistory() {
  return read('history', []);
}

export function addToHistory(item) {
  if (!isPersonalizationAllowed()) return;
  const list = getHistory().filter(
    (h) => !(h.id === item.id && h.media_type === item.media_type)
  );
  const entry = {
    id: item.id,
    media_type: item.media_type,
    title: item.title,
    poster_path: item.poster_path,
    imageSrc: item.imageSrc,
    releaseYear: item.releaseYear,
    rating: item.rating,
    backdrop_path: item.backdrop_path,
    overview: item.overview,
    progress: item.progress ?? 0,
    season: item.season ?? null,
    episode: item.episode ?? null,
    watched_at: new Date().toISOString(),
  };
  list.unshift(entry);
  write('history', list.slice(0, 60));
}

export function updateHistoryProgress(id, media_type, progress, season, episode) {
  if (!isPersonalizationAllowed()) return;
  const list = getHistory().map((h) => {
    if (h.id === id && h.media_type === media_type) {
      return {
        ...h,
        progress,
        season: season ?? h.season,
        episode: episode ?? h.episode,
        watched_at: new Date().toISOString(),
      };
    }
    return h;
  });
  write('history', list);
}

export function removeFromHistory(id, media_type) {
  write('history', getHistory().filter((h) => !(h.id === id && h.media_type === media_type)));
}

export function clearHistory() {
  write('history', []);
}

/* ---- my list (watchlist) ---- */

export function getWatchlist() {
  return read('watchlist', []);
}

export function isInWatchlist(id, media_type) {
  return getWatchlist().some((m) => m.id === id && m.media_type === media_type);
}

export function toggleWatchlist(item) {
  const list = getWatchlist();
  const exists = list.some((m) => m.id === item.id && m.media_type === item.media_type);
  const next = exists
    ? list.filter((m) => !(m.id === item.id && m.media_type === item.media_type))
    : [
        {
          id: item.id,
          media_type: item.media_type,
          title: item.title,
          poster_path: item.poster_path,
          imageSrc: item.imageSrc,
          releaseYear: item.releaseYear,
          rating: item.rating,
          backdrop_path: item.backdrop_path,
          overview: item.overview,
        },
        ...list,
      ];
  guardedWrite('watchlist', next);
  return !exists; // true if now added
}

/* ---- likes ---- */

export function getLikes() {
  return read('likes', []);
}

export function isLiked(id, media_type) {
  return getLikes().some((m) => m.id === id && m.media_type === media_type);
}

export function toggleLike(item) {
  const list = getLikes();
  const exists = list.some((m) => m.id === item.id && m.media_type === item.media_type);
  const next = exists
    ? list.filter((m) => !(m.id === item.id && m.media_type === item.media_type))
    : [item, ...list];
  guardedWrite('likes', next);
  return !exists;
}

/* ---- personal ratings (1-5) ---- */

export function getRatings() {
  return read('ratings', {});
}

export function getRating(id, media_type) {
  return getRatings()[`${media_type}-${id}`] || 0;
}

export function setRating(id, media_type, value) {
  const ratings = getRatings();
  if (!value || value <= 0) {
    delete ratings[`${media_type}-${id}`];
  } else {
    ratings[`${media_type}-${id}`] = value;
  }
  guardedWrite('ratings', ratings);
}

/* ----------------------- most-viewed counter ---------------------------- */
/*
 * Incremented every time a title is opened on the Watch page. Used to derive
 * the dynamic "Most Viewed on Xstream" badge per browser.
 */
export function getViewCounts() {
  return read('views', {});
}

export function registerView(id, media_type) {
  if (!isPersonalizationAllowed()) return 0;
  const counts = getViewCounts();
  const key = `${media_type}-${id}`;
  counts[key] = (counts[key] || 0) + 1;
  write('views', counts);
  return counts[key];
}

export function getMostViewed() {
  const counts = getViewCounts();
  let bestKey = null;
  let bestCount = 0;
  Object.entries(counts).forEach(([key, count]) => {
    if (count > bestCount) {
      bestCount = count;
      bestKey = key;
    }
  });
  if (!bestKey) return null;
  const [media_type, id] = bestKey.split('-');
  return { id: Number(id), media_type, count: bestCount };
}

export function isMostViewed(id, media_type) {
  const mv = getMostViewed();
  if (!mv) return false;
  return mv.id === Number(id) && mv.media_type === media_type;
}

export function getMostViewedList(limit = 10) {
  // join view counts with history entries so we have posters/titles
  const counts = getViewCounts();
  const history = getHistory();
  const list = Object.entries(counts)
    .map(([key, count]) => {
      const [media_type, idStr] = key.split('-');
      const id = Number(idStr);
      const meta = history.find((h) => h.id === id && h.media_type === media_type) || {};
      return { id, media_type, count, ...meta };
    })
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  return list;
}

/* ----------------------------- preferences ------------------------------ */

export function getPrefs() {
  return read('prefs', {
    accentColor: '#E50914',
    autoplayNext: true,
    preferredServer: null,
    hasSeenIntro: false,
  });
}

export function setPref(key, value) {
  const prefs = getPrefs();
  prefs[key] = value;
  // prefs (theme, accent) are allowed even before consent — they're not
  // personal data. We mirror accent to localStorage directly.
  write('prefs', prefs);
}

/* ------------------------------- wipe ----------------------------------- */

export function wipeAllPersonalData() {
  ['history', 'watchlist', 'likes', 'ratings', 'views'].forEach((k) => write(k, k === 'history' || k === 'watchlist' || k === 'likes' ? [] : k === 'ratings' ? {} : {}));
}

export function resetEverything() {
  ['history', 'watchlist', 'likes', 'ratings', 'views'].forEach((k) => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(PREFIX + k);
  });
}

/* --------------------------- event subscribe --------------------------- */

export function subscribe(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('xs-storage', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('xs-storage', handler);
    window.removeEventListener('storage', handler);
  };
}

export { PREFIX, CONSENT_COOKIE, VISITOR_COOKIE };
