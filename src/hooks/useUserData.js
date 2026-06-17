import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export const useUserData = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setWatchHistory([]);
      return;
    }

    setLoadingLists(true);
    try {
      const [wishlistRes, historyRes] = await Promise.all([
        supabase.from('wishlist').select('*').eq('user_id', user.id).order('added_at', { ascending: false }),
        supabase.from('watch_history').select('*').eq('user_id', user.id).order('watched_at', { ascending: false })
      ]);

      if (wishlistRes.error) throw wishlistRes.error;
      if (historyRes.error) throw historyRes.error;

      setWishlist(wishlistRes.data || []);
      setWatchHistory(historyRes.data || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingLists(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const addToWishlist = async (mediaData) => {
    if (!user) return false;
    try {
      const { data, error } = await supabase.from('wishlist').upsert({
        user_id: user.id,
        media_id: mediaData.id,
        media_type: mediaData.media_type,
        title: mediaData.title,
        image_src: mediaData.imageSrc || mediaData.image_src,
        release_year: mediaData.releaseYear || mediaData.release_year,
        rating: mediaData.rating
      }, { onConflict: 'user_id, media_id, media_type' }).select().single();

      if (error) throw error;
      
      setWishlist(prev => {
        const filtered = prev.filter(item => !(item.media_id === mediaData.id && item.media_type === mediaData.media_type));
        return [data, ...filtered];
      });
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (mediaId, mediaType) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .match({ user_id: user.id, media_id: mediaId, media_type: mediaType });

      if (error) throw error;
      
      setWishlist(prev => prev.filter(item => !(item.media_id === mediaId && item.media_type === mediaType)));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const addToHistory = async (mediaData) => {
    if (!user) return false;
    try {
      const { data, error } = await supabase.from('watch_history').upsert({
        user_id: user.id,
        media_id: mediaData.id,
        media_type: mediaData.media_type,
        title: mediaData.title,
        image_src: mediaData.imageSrc || mediaData.image_src,
        release_year: mediaData.releaseYear || mediaData.release_year,
        rating: mediaData.rating,
        watched_at: new Date().toISOString()
      }, { onConflict: 'user_id, media_id, media_type' }).select().single();

      if (error) throw error;
      
      setWatchHistory(prev => {
        const filtered = prev.filter(item => !(item.media_id === mediaData.id && item.media_type === mediaData.media_type));
        return [data, ...filtered];
      });
      return true;
    } catch (error) {
      console.error('Error adding to history:', error);
      return false;
    }
  };

  const isInWishlist = (mediaId, mediaType) => {
    return wishlist.some(item => item.media_id === mediaId && item.media_type === mediaType);
  };

  return {
    wishlist,
    watchHistory,
    loadingLists,
    addToWishlist,
    removeFromWishlist,
    addToHistory,
    isInWishlist,
    refreshUserData: fetchUserData
  };
};
