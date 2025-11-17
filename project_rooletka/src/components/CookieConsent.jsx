import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/CookieConsent.css';

const CookieConsent = ({ onAccept, onReject }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const cookieDecision = localStorage.getItem('cookie-consent');
    if (!cookieDecision) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    setTimeout(() => onAccept(), 300);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
    setTimeout(() => onReject(), 300);
  };

  const handleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="cookie-consent-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="cookie-consent-modal"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <div className="cookie-header">
            <h3>🍪 НАСТРОЙКИ КОНФИДЕНЦИАЛЬНОСТИ</h3>
            <div className="cookie-status">СИСТЕМА УПРАВЛЕНИЯ ДАННЫМИ</div>
          </div>

          <div className="cookie-content">
            <div className="cookie-message">
              <p>Система использует localStorage для сохранения ваших предпочтений:</p>
              
              <div className="cookie-features">
                <div className="cookie-feature">
                  <span className="feature-icon">🎨</span>
                  <span className="feature-text">Тема оформления (светлая/тёмная)</span>
                </div>
                <div className="cookie-feature">
                  <span className="feature-icon">💾</span>
                  <span className="feature-text">Сохранённые цитаты</span>
                </div>
                <div className="cookie-feature">
                  <span className="feature-icon">⚙️</span>
                  <span className="feature-text">Настройки системы</span>
                </div>
              </div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    className="cookie-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h4>ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ:</h4>
                    <ul>
                      <li>• Данные хранятся только в вашем браузере</li>
                      <li>• Информация не передаётся на сервер</li>
                      <li>• Вы можете очистить данные в любое время</li>
                      <li>• Без сохранения настройки будут сбрасываться</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="cookie-controls">
              <motion.button
                className="cookie-btn secondary"
                onClick={handleDetails}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showDetails ? 'СКРЫТЬ ДЕТАЛИ' : 'ПОДРОБНЕЕ'}
              </motion.button>
              
              <div className="cookie-actions">
                <motion.button
                  className="cookie-btn reject"
                  onClick={handleReject}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ОТКЛОНИТЬ
                </motion.button>
                
                <motion.button
                  className="cookie-btn accept"
                  onClick={handleAccept}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ПРИНЯТЬ
                </motion.button>
              </div>
            </div>
          </div>

          <div className="cookie-footer">
            <span>Ваши данные защищены. Данные хранятся только локально.</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;