// src/lib/useStore.js
// Reactive React hooks over the cookie/localStorage account layer.
import { useState, useEffect, useCallback } from 'react';
import * as store from './storage';

function useReactiveSelector(selector, deps = []) {
  const [value, setValue] = useState(() => selector());
  useEffect(() => {
    const update = () => setValue(() => selector());
    update();
    const unsub = store.subscribe(update);
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}

export function useConsent() {
  const consent = useReactiveSelector(() => store.getConsent(), []);
  return {
    consent,
    accepted: consent === 'accepted',
    declined: consent === 'declined',
    needsChoice: consent === null,
    accept: store.acceptConsent,
    decline: store.declineConsent,
    since: store.getConsentDate(),
  };
}

export function useVisitor() {
  return useReactiveSelector(() => store.getVisitorId(), []);
}

export function useHistory() {
  return useReactiveSelector(() => store.getHistory(), []);
}

export function useWatchlist() {
  return useReactiveSelector(() => store.getWatchlist(), []);
}

export function useLikes() {
  return useReactiveSelector(() => store.getLikes(), []);
}

export function useRatings() {
  return useReactiveSelector(() => store.getRatings(), []);
}

export function useMostViewed() {
  return useReactiveSelector(() => store.getMostViewed(), []);
}

export function useMostViewedList(limit = 10) {
  return useReactiveSelector(() => store.getMostViewedList(limit), [limit]);
}

export function usePrefs() {
  return useReactiveSelector(() => store.getPrefs(), []);
}

/* convenience action bundle for cards / pages */
export function useActions() {
  const [tick, force] = useState(0);
  useEffect(() => store.subscribe(() => force((t) => t + 1)), []);
  // tick keeps the memoized callbacks reading fresh state
  void tick;
  return {
    addToHistory: useCallback((item) => store.addToHistory(item), []),
    updateProgress: useCallback(
      (id, mt, progress, season, episode) =>
        store.updateHistoryProgress(id, mt, progress, season, episode),
      []
    ),
    removeFromHistory: useCallback((id, mt) => store.removeFromHistory(id, mt), []),
    clearHistory: useCallback(() => store.clearHistory(), []),
    toggleWatchlist: useCallback((item) => store.toggleWatchlist(item), []),
    isInWatchlist: useCallback((id, mt) => store.isInWatchlist(id, mt), []),
    toggleLike: useCallback((item) => store.toggleLike(item), []),
    isLiked: useCallback((id, mt) => store.isLiked(id, mt), []),
    setRating: useCallback((id, mt, v) => store.setRating(id, mt, v), []),
    getRating: useCallback((id, mt) => store.getRating(id, mt), []),
    registerView: useCallback((id, mt) => store.registerView(id, mt), []),
    isMostViewed: useCallback((id, mt) => store.isMostViewed(id, mt), []),
    setPref: useCallback((k, v) => store.setPref(k, v), []),
  };
}
