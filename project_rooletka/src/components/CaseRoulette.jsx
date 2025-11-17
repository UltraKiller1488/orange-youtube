import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quotes } from '../data/quotesData';
import { gsap } from 'gsap';
import '../styles/CaseRoulette.css';

const CaseRoulette = ({ onAddToFavorites, corruption, addSystemMessage, isDarkTheme }) => {
  const [isDecoding, setIsDecoding] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [decodedText, setDecodedText] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [isError, setIsError] = useState(false);
  const terminalRef = useRef();

  const errorMessages = [
    "ОШИБКА ДЕКОДИРОВКИ: ПОВРЕЖДЕННЫЕ ДАННЫЕ",
    "СБОЙ СИСТЕМЫ: НЕВОЗМОЖНО ВОССТАНОВИТЬ ЦИТАТУ",
    "КРИТИЧЕСКИЙ СБОЙ: ДОСТУП ЗАПРЕЩЕН",
    "ОШИБКА 0x7F3A1C: НАРУШЕНИЕ ЦЕЛОСТНОСТИ",
    "СИСТЕМНЫЙ СБОЙ: ЦИТАТА УТЕРЯНА",
    "КОРРУПЦИЯ ПАМЯТИ: ДАННЫЕ УНИЧТОЖЕНЫ",
    "ОШИБКА ЧТЕНИЯ СЕКТОРА: ПОВРЕЖДЕННЫЙ БЛОК",
    "НЕВОССТАНАВЛИВАЕМАЯ ОШИБКА ДЕКОДИРОВКИ"
  ];

  const startGlitchEffect = () => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const glitch = document.createElement('div');
        glitch.style.cssText = `
          position: absolute;
          top: ${20 + Math.random() * 60}%;
          left: ${20 + Math.random() * 60}%;
          width: ${10 + Math.random() * 50}px;
          height: 3px;
          background: ${isDarkTheme ? '#ff0000' : '#00ffff'};
          opacity: 0;
          transform: rotate(${Math.random() * 360}deg);
          pointer-events: none;
          z-index: 100;
        `;
        document.querySelector('.decoder-container').appendChild(glitch);

        gsap.to(glitch, {
          duration: 0.2,
          opacity: 0.8,
          x: Math.random() * 100 - 50,
          onComplete: () => {
            gsap.to(glitch, {
              duration: 0.1,
              opacity: 0,
              onComplete: () => {
                if (glitch.parentNode) {
                  glitch.parentNode.removeChild(glitch);
                }
              }
            });
          }
        });
      }, i * 100);
    }
  };

  const startDecoding = () => {
    if (isDecoding) return;
    
    setIsDecoding(true);
    setCurrentQuote(null);
    setDecodedText('');
    setShowCompletion(false);
    setIsError(false);

    addSystemMessage('ЗАПУСК ПРОЦЕССА ДЕКОДИРОВКИ...', 'info');
    startGlitchEffect();

    if (isDarkTheme && Math.random() < 0.4) {
      const errorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      setIsError(true);
      
      let currentIndex = 0;
      const decodeInterval = setInterval(() => {
        if (currentIndex <= errorMessage.length) {
          setDecodedText(errorMessage.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(decodeInterval);
          setTimeout(() => {
            setIsDecoding(false);
            setShowCompletion(true);
            addSystemMessage('СБОЙ ДЕКОДИРОВКИ! ДАННЫЕ УТЕРЯНЫ!', 'error');
          }, 1000);
        }
      }, 50);
      return;
    }

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);

    let currentIndex = 0;
    const targetText = randomQuote.text;
    
    const decodeInterval = setInterval(() => {
      if (currentIndex <= targetText.length) {
        setDecodedText(targetText.substring(0, currentIndex));
        currentIndex++;
        
        if (currentIndex === Math.floor(targetText.length / 2)) {
          addSystemMessage('ДЕКОДИРОВАНИЕ: 50% ВЫПОЛНЕНО', 'info');
        }
      } else {
        clearInterval(decodeInterval);
        setTimeout(() => {
          setIsDecoding(false);
          setShowCompletion(true);
          onAddToFavorites(randomQuote);
          addSystemMessage(`ЦИТАТА ДЕКОДИРОВАНА: ${randomQuote.author}`, 'info');
        }, 1000);
      }
    }, 50);
  };

  const resetTerminal = () => {
    setIsDecoding(false);
    setCurrentQuote(null);
    setDecodedText('');
    setShowCompletion(false);
    setIsError(false);
    addSystemMessage('СБРОС СИСТЕМЫ ДЕКОДИРОВАНИЯ', 'info');
  };

  useEffect(() => {
    addSystemMessage('ДЕКОДЕР ЦИТАТ: СИСТЕМА ГОТОВА', 'info');
  }, [addSystemMessage]);

  return (
    <div className="decoder-container" ref={terminalRef}>
      <div className="scan-line"></div>

      <div className="decoder-header">
        <h2>ТЕРМИНАЛ ДЕКОДИРОВКИ</h2>
        <div className="decoder-stats">
          <span>ЦИТАТ В БАЗЕ: {quotes.length}</span>
          {isDarkTheme && <span style={{color: '#ff0000', marginLeft: '10px'}}>│ РЕЖИМ ОПАСНОСТИ</span>}
        </div>
      </div>

      <div className="decoder-window">
        <AnimatePresence mode="wait">
          {!currentQuote && !isDecoding && !isError && (
            <motion.div
              key="idle"
              className="decoder-idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <div className="idle-message">
                {isDarkTheme ? 'СИСТЕМА НЕСТАБИЛЬНА - ОПАСНОСТЬ СБОЯ' : 'СИСТЕМА ГОТОВА К ДЕКОДИРОВКЕ'}
              </div>
              <p>{isDarkTheme ? 'Высокий риск ошибки декодирования' : 'Нажмите "Декодировать" для получения случайной цитаты'}</p>
            </motion.div>
          )}

          {(isDecoding || currentQuote || isError) && (
            <motion.div
              key="decoding"
              className="decoder-active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="decoding-header">
                <span>{isError ? 'СБОЙ ДЕКОДИРОВКИ...' : 'ДЕКОДИРОВАНИЕ...'}</span>
                {currentQuote && (
                  <span className="quote-category">#{currentQuote.short}</span>
                )}
                {isError && (
                  <span className="quote-category" style={{background: '#660000', color: '#ff0000'}}>#ОШИБКА</span>
                )}
              </div>

              <div className="quote-display">
                <div className="quote-text" style={{color: isError ? '#ff0000' : '#fff'}}>
                  {decodedText}
                  {isDecoding && ((currentQuote && decodedText.length < currentQuote.text.length) || (isError && decodedText.length < errorMessages[0].length)) && (
                    <span className="typewriter-cursor" style={{background: isError ? '#ff0000' : '#00ff00'}}>|</span>
                  )}
                </div>
                
                {currentQuote && decodedText === currentQuote.text && (
                  <motion.div 
                    className="quote-author"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    — {currentQuote.author}
                  </motion.div>
                )}
              </div>

              {showCompletion && (
                <motion.div 
                  className="decoding-complete"
                  style={{
                    background: isError ? 'linear-gradient(135deg, #660000, #990000)' : 'linear-gradient(135deg, #003300, #005500)',
                    color: isError ? '#ff0000' : '#00ff00',
                    border: isError ? '1px solid #ff0000' : '1px solid #00ff00'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {isError ? 'Ошибка! Данные утеряны' : 'Цитата сохранена в архив'}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="decoder-controls">
        <motion.button
          className={`control-btn decode-btn ${isDecoding ? 'disabled' : ''}`}
          onClick={startDecoding}
          disabled={isDecoding}
          whileHover={{ scale: isDecoding ? 1 : 1.05 }}
          whileTap={{ scale: isDecoding ? 1 : 0.95 }}
        >
          {isDecoding ? 'ДЕКОДИРОВАНИЕ...' : 'ДЕКОДИРОВАТЬ'}
        </motion.button>
        
        <motion.button
          className="control-btn reset-btn"
          onClick={resetTerminal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          СБРОС
        </motion.button>
      </div>
    </div>
  );
};

export default CaseRoulette;