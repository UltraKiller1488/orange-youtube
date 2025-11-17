import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CaseRoulette from './CaseRoulette';
import Favorites from './Favorites';
import Particles from './Particles';
import SystemMessages from './SystemMessages';
import ThreeJSBackground from './ThreeJSBackground';
import GlitchOverlay from './GlitchOverlay';
import GlitchInteraction from './GlitchInteraction';
import ScreamerEffect from './ScreamerEffect';
import CursorManager from './CursorManager';
import { useFavorites } from '../hooks/useFavorites';
import '../styles/Main.css';
import '../styles/VHSEffects.css';
import '../styles/DarkTheme.css';
import '../styles/EnhancedGlow.css';
import '../styles/CursorManager.css';

const Main = () => {
  const [currentView, setCurrentView] = useState('terminal');
  const { favorites, addToFavorites, favoritesCount, isLoaded } = useFavorites();
  const [systemCorruption, setSystemCorruption] = useState(0);
  const [systemMessages, setSystemMessages] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [themeSwitchCount, setThemeSwitchCount] = useState(0);
  const [isScreamerActive, setIsScreamerActive] = useState(false);
  const [screamerType, setScreamerType] = useState('normal');

  const addSystemMessage = useCallback((text, type = 'info') => {
    const newMessage = {
      id: Date.now() + Math.random(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    };
    
    setSystemMessages(prev => [newMessage, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setSystemMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 6000);
  }, []);

  useEffect(() => {
    console.log('🎨 Loading theme settings...');
    
    try {
      const savedTheme = localStorage.getItem('theme');
      const savedSettings = localStorage.getItem('user-settings');
      
      console.log('📥 Theme from localStorage:', savedTheme);
      console.log('📥 User settings from localStorage:', savedSettings);

      if (savedTheme) {
        setIsDarkTheme(savedTheme === 'dark');
      }

      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.theme !== undefined) {
          setIsDarkTheme(settings.theme);
        }
      }
    } catch (error) {
      console.log('❌ Error loading theme:', error);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log('🚀 System fully initialized');
      console.log('💫 Current favorites:', favorites);
      addSystemMessage('СИСТЕМА ЗАПУЩЕНА', 'info');
      
      if (favorites.length > 0) {
        addSystemMessage(`ЗАГРУЖЕНО ${favorites.length} ЦИТАТ ИЗ АРХИВА`, 'info');
      }
    }
  }, [isLoaded, favorites.length, addSystemMessage]);

  useEffect(() => {
    try {
      localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
      
      const settings = {
        theme: isDarkTheme,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('user-settings', JSON.stringify(settings));
      
      console.log('💾 Theme saved:', isDarkTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('❌ Error saving theme:', error);
    }
  }, [isDarkTheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemCorruption(prev => {
        const increment = isDarkTheme ? 0.002 : 0.001;
        return Math.min(prev + increment, isDarkTheme ? 0.95 : 0.8);
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isDarkTheme]);

  const randomThemeSwitch = useCallback(() => {
    if (Math.random() < 0.3) {
      setIsDarkTheme(prev => {
        const newTheme = !prev;
        setThemeSwitchCount(prevCount => prevCount + 1);
        addSystemMessage(
          newTheme ? '⚡ АКТИВИРОВАНА ТЕМНАЯ ТЕМА - ОПАСНОСТЬ!' : '⚡ ВОЗВРАТ К СТАНДАРТНОЙ СХЕМЕ', 
          'error'
        );
        setSystemCorruption(prev => Math.min(prev + 0.3, 0.95));
        return newTheme;
      });
    }
  }, [addSystemMessage]);

  const activateScreamer = useCallback(() => {
    if (isScreamerActive) return;
    
    const screamerType = isDarkTheme ? 'dark' : 'normal';
    setScreamerType(screamerType);
    setIsScreamerActive(true);
    
    addSystemMessage(
      isDarkTheme ? '⚠️ КРИТИЧЕСКИЙ СБОЙ СИСТЕМЫ! УГРОЗА ОБНАРУЖЕНА!' : '⚠️ КРИТИЧЕСКИЙ СБОЙ СИСТЕМЫ!',
      'error'
    );
    setSystemCorruption(prev => Math.min(prev + 0.4, 1.0));
    
    document.body.style.pointerEvents = 'none';
    document.body.style.overflow = 'hidden';
  }, [isScreamerActive, isDarkTheme, addSystemMessage]);

  const completeScreamer = useCallback(() => {
    setIsScreamerActive(false);
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = '';
    addSystemMessage('СИСТЕМА ВОССТАНОВЛЕНА', 'info');
  }, [addSystemMessage]);

  const handleAddToFavorites = useCallback((quote) => {
    console.log('🎯 Adding quote to favorites:', quote);
    
    if (isDarkTheme && Math.random() < 0.4) {
      addSystemMessage('ОШИБКА: ЦИТАТА НЕ СОХРАНЕНА. КОРРУПЦИЯ ДАННЫХ.', 'error');
      return;
    }
    
    const addedFavorite = addToFavorites(quote);
    console.log('✅ Favorite added:', addedFavorite);
    
    setSystemCorruption(prev => Math.min(prev + 0.05, 0.9));
    addSystemMessage(`ЦИТАТА ДОБАВЛЕНА В АРХИВ: ${quote.short}`, 'info');
    
    setTimeout(() => {
      const currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      console.log('🔍 Immediate verification - favorites in localStorage:', currentFavorites);
    }, 100);
  }, [addSystemMessage, isDarkTheme, addToFavorites]);

  const handleViewChange = useCallback((view) => {
    if (isScreamerActive) return;
    
    setCurrentView(view);
    
    if (view === 'terminal') {
      addSystemMessage('ПЕРЕКЛЮЧЕНИЕ: ДЕКОДЕР ЦИТАТ', 'info');
    } else if (view === 'archive') {
      addSystemMessage(`ПЕРЕКЛЮЧЕНИЕ: АРХИВ (${favoritesCount} ЦИТАТ)`, 'info');
    }
  }, [favoritesCount, addSystemMessage, isScreamerActive]);

  const views = {
    terminal: { 
      component: <CaseRoulette 
        onAddToFavorites={handleAddToFavorites} 
        corruption={systemCorruption} 
        addSystemMessage={addSystemMessage}
        isDarkTheme={isDarkTheme}
      />,
      label: 'ДЕКОДЕР ЦИТАТ'
    },
    archive: { 
      component: <Favorites 
        favorites={favorites} 
        corruption={systemCorruption} 
        addSystemMessage={addSystemMessage}
        isDarkTheme={isDarkTheme}
      />,
      label: `АРХИВ (${favoritesCount})`
    }
  };

  if (!isLoaded) {
    return (
      <div className="main-container loading">
        <div className="loading-state">
          <h3>ЗАГРУЗКА СИСТЕМЫ...</h3>
          <p>Инициализация модуля сохранения данных</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`main-container ${isDarkTheme ? 'dark-theme' : ''} ${isScreamerActive ? 'screamer-active' : ''}`}
      style={{ '--corruption-level': systemCorruption }}
      data-theme-switches={themeSwitchCount}
    >
      <CursorManager addSystemMessage={addSystemMessage} isDarkTheme={isDarkTheme} />

      <ThreeJSBackground corruptionLevel={systemCorruption} />

      <div className="background-effects">
        <div className="grid-pattern"></div>
        <div className="data-rain"></div>
        <div className="corruption-field"></div>
        <div className="scan-sweep"></div>
        <div className="crt-glitch"></div>
        <div className="vhs-noise"></div>
        <Particles count={30} corruption={systemCorruption} />
      </div>

      <GlitchOverlay corruption={systemCorruption} />

      <GlitchInteraction 
        onRandomThemeSwitch={randomThemeSwitch} 
        onScreamerActivate={activateScreamer}
        isScreamerActive={isScreamerActive}
      />

      <ScreamerEffect 
        isActive={isScreamerActive} 
        onComplete={completeScreamer}
        screamerType={screamerType}
      />

      <nav className="main-navigation">
        {Object.entries(views).map(([key, view]) => (
          <motion.button
            key={key}
            className={`nav-btn ${currentView === key ? 'active' : ''}`}
            onClick={() => handleViewChange(key)}
            whileHover={{ scale: isScreamerActive ? 1 : 1.05 }}
            whileTap={{ scale: isScreamerActive ? 1 : 0.95 }}
            disabled={isScreamerActive}
          >
            {view.label}
          </motion.button>
        ))}

        {themeSwitchCount > 0 && (
          <div className="theme-indicator" title={`Смена темы: ${themeSwitchCount}`}>
            ⚡{themeSwitchCount}
          </div>
        )}
      </nav>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            className="view-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: isScreamerActive ? 0.1 : 1, 
              x: 0,
              scale: isScreamerActive ? 0.9 : 1,
              filter: isScreamerActive ? 'blur(5px)' : 'none'
            }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            {views[currentView].component}
          </motion.div>
        </AnimatePresence>
      </main>

      <SystemMessages messages={systemMessages} />

      <footer className="main-footer">
        <motion.div 
          className="system-status"
          animate={{ 
            opacity: isScreamerActive ? [0.1, 0.05, 0.1] : [1, 0.7, 1] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="glitch-title">
            СИСТЕМА ЦИТАТНИК v2.0 | {isDarkTheme ? '🔴 ТЕМНАЯ ТЕМА - ОПАСНО!' : '🟢 СТАНДАРТ'} | 
            {isScreamerActive ? ' ⚠️ КРИТИЧЕСКИЙ СБОЙ' : ` КОРРУПЦИЯ: ${Math.round(systemCorruption * 100)}%`}
          </span>
          <span className="favorites-count">СОХРАНЕНО ЦИТАТ: {favoritesCount}</span>
        </motion.div>
      </footer>
    </div>
  );
};

export default Main;