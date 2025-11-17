import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('🔄 useFavorites: Initializing...');
    
    try {
      const saved = localStorage.getItem('favorites');
      console.log('📥 useFavorites: Raw data from localStorage:', saved);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📊 useFavorites: Parsed data:', parsed);
        
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          console.log('✅ useFavorites: Successfully loaded', parsed.length, 'favorites');
        } else {
          console.log('⚠️ useFavorites: Invalid data format, using empty array');
          localStorage.setItem('favorites', JSON.stringify([]));
        }
      } else {
        console.log('ℹ️ useFavorites: No saved favorites found');
      }
    } catch (error) {
      console.log('❌ useFavorites: Error loading favorites:', error);
      localStorage.setItem('favorites', JSON.stringify([]));
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    console.log('💾 useFavorites: Saving to localStorage:', favorites);
    
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
      console.log('✅ useFavorites: Successfully saved', favorites.length, 'favorites');
      
      const verify = localStorage.getItem('favorites');
      console.log('🔍 useFavorites: Verification -', verify === JSON.stringify(favorites) ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('❌ useFavorites: Error saving favorites:', error);
    }
  }, [favorites, isLoaded]);

  const addToFavorites = (quote) => {
    console.log('➕ useFavorites: Adding quote:', quote);
    
    const newFavorite = {
      ...quote,
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleString('ru-RU')
    };

    setFavorites(prev => {
      const updated = [...prev, newFavorite];
      console.log('📋 useFavorites: New favorites list:', updated);
      return updated;
    });

    return newFavorite;
  };

  const removeFromFavorites = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    favoritesCount: favorites.length,
    isLoaded
  };
};