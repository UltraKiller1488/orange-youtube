import { useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import '../styles/Favorites.css';

const Favorites = ({ favorites, corruption, addSystemMessage, isDarkTheme }) => {
  const corruptedFavorites = useMemo(() => {
    if (!isDarkTheme) return new Set();
    
    const corruptedIndices = new Set();
    const corruptionCount = Math.ceil(favorites.length * 0.2);
    
    for (let i = 0; i < corruptionCount && i < favorites.length; i++) {
      const index = (i * 7) % favorites.length;
      corruptedIndices.add(favorites[index].id);
    }
    
    return corruptedIndices;
  }, [favorites, isDarkTheme]);

  const handleCardClick = useCallback((favorite, isCorrupted) => {
    const message = isCorrupted 
      ? 'ОШИБКА: ДАННЫЕ ЦИТАТЫ ПОВРЕЖДЕНЫ'
      : `ПРОСМОТР ЦИТАТЫ: ${favorite.short}`;
    
    addSystemMessage(message, isCorrupted ? 'error' : 'info');
  }, [addSystemMessage]);

  useEffect(() => {
    if (favorites.length > 0) {
      addSystemMessage(`ДОСТУП К АРХИВУ: ${favorites.length} ЦИТАТ`, 'info');
    }
  }, [favorites.length, addSystemMessage]);

  if (favorites.length === 0) {
    return (
      <motion.div 
        className="favorites-empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="empty-state">
          <h3>{isDarkTheme ? 'АРХИВ ПУСТ - ДАННЫЕ УТЕРЯНЫ' : 'АРХИВ ПУСТ'}</h3>
          <p>
            {isDarkTheme 
              ? 'ВЫСОКИЙ РИСК ПОТЕРИ ДАННЫХ ПРИ ДЕКОДИРОВАНИИ' 
              : 'ДЕКОДИРУЙТЕ ЦИТАТЫ, ЧТОБЫ ОНИ ПОЯВИЛИСЬ ЗДЕСЬ'
            }
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="favorites-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="favorites-header">
        <h2>{isDarkTheme ? 'ПОВРЕЖДЕННЫЙ АРХИВ ЦИТАТ' : 'АРХИВ ЦИТАТ'}</h2>
        <div className="favorites-stats">
          <span>СОХРАНЕНО: {favorites.length}</span>
          {isDarkTheme && (
            <span style={{ color: '#ff0000', marginLeft: '10px' }}>
              │ ЦЕЛОСТНОСТЬ: {Math.max(0, 100 - corruptedFavorites.size * 5)}%
            </span>
          )}
        </div>
      </div>

      <div className="favorites-grid">
        {favorites.map((favorite, index) => {
          const isCorrupted = corruptedFavorites.has(favorite.id);
          const cardStyle = isCorrupted ? {
            background: '#660000',
            borderColor: '#ff0000',
            color: '#ff0000'
          } : {};
          
          const textStyle = isCorrupted ? {
            color: '#ff0000',
            fontStyle: 'normal'
          } : {};

          return (
            <motion.div
              key={favorite.id}
              className={`favorite-card ${isCorrupted ? 'corrupted-card' : ''}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(favorite, isCorrupted)}
              style={cardStyle}
            >
              <div className="card-header">
                <span className="card-id">
                  {isCorrupted ? '⚠️ ' : ''}#{favorite.id}
                </span>
                <span 
                  className="card-category"
                  style={isCorrupted ? {
                    background: '#330000',
                    color: '#ff0000',
                    borderColor: '#ff0000'
                  } : {}}
                >
                  {isCorrupted ? 'КОРРУПЦИЯ' : favorite.short}
                </span>
              </div>
              
              <div className="card-content">
                <motion.p 
                  className="quote-text"
                  style={textStyle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  "{isCorrupted ? 'ОШИБКА ЧТЕНИЯ ДАННЫХ' : favorite.text}"
                </motion.p>
                <motion.p 
                  className="quote-author"
                  style={textStyle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  — {isCorrupted ? 'СИСТЕМНЫЙ СБОЙ' : favorite.author}
                </motion.p>
              </div>

              {/* Индикатор состояния */}
              {isDarkTheme && (
                <div className="card-status">
                  <div 
                    className="status-indicator"
                    style={{ 
                      background: isCorrupted ? '#ff0000' : '#00ff00',
                      boxShadow: isCorrupted ? '0 0 10px #ff0000' : '0 0 10px #00ff00'
                    }}
                  />
                  <span className="status-text">
                    {isCorrupted ? 'ПОВРЕЖДЕНА' : 'СТАБИЛЬНА'}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Статистика в футере */}
      {isDarkTheme && corruptedFavorites.size > 0 && (
        <motion.div 
          className="favorites-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="corruption-stats">
            <span>ПОВРЕЖДЕННЫЕ ЦИТАТЫ: {corruptedFavorites.size}</span>
            <span>УРОВЕНЬ КОРРУПЦИИ: {Math.round((corruptedFavorites.size / favorites.length) * 100)}%</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Favorites;