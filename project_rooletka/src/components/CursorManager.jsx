import { useState, useEffect, useCallback } from 'react';
import DefaultCursor from '../cursors/DefaultCursor';
import NeuralCursor from '../cursors/NeuralCursor';
import TraceCursor from '../cursors/TraceCursor';
import PulseCursor from '../cursors/PulseCursor';
import QuantumCursor from '../cursors/QuantumCursor';
import { useCursorCookies } from '../hooks/useCookies';

const CURSORS_CONFIG = {
  default: {
    name: 'Стандартный',
    component: DefaultCursor,
    description: 'Классический курсор с точкой и кольцом'
  },
  neural: {
    name: 'Нейросетевой',
    component: NeuralCursor,
    description: 'Нейронные соединения'
  },
  trace: {
    name: 'Трассирующий',
    component: TraceCursor,
    description: 'След из постепенно исчезающих точек'
  },
  pulse: {
    name: 'Пульсирующий',
    component: PulseCursor,
    description: 'Ритмично пульсирующий круг'
  },
  quantum: {
    name: 'Квантовый',
    component: QuantumCursor,
    description: 'Вероятностные частицы с неопределенностью'
  }
};

const CursorManager = ({ isDarkTheme = false, addSystemMessage }) => {
  const [cursorType, setCursorType] = useCursorCookies('default');
  const [showCursorMenu, setShowCursorMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '1' && e.key <= '5') {
        const cursorKeys = Object.keys(CURSORS_CONFIG);
        const index = parseInt(e.key) - 1;
        if (cursorKeys[index]) {
          setCursorType(cursorKeys[index]);
          setShowCursorMenu(false);
          if (addSystemMessage) {
            addSystemMessage(`КУРСОР ИЗМЕНЕН: ${CURSORS_CONFIG[cursorKeys[index]].name}`, 'info');
          }
        }
      }

      if (e.key === '0') {
        setShowCursorMenu(prev => !prev);
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyPress, true);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress, true);
    }
  }, [setCursorType, addSystemMessage]);

  useEffect(() => {
    let timeoutId;
    const handleMouseActivity = () => {
      setIsVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsVisible(false), 3000);
    };

    document.addEventListener('mousemove', handleMouseActivity);
    document.addEventListener('mousedown', handleMouseActivity);

    return () => {
      document.removeEventListener('mousemove', handleMouseActivity);
      document.removeEventListener('mousedown', handleMouseActivity);
      clearTimeout(timeoutId);
    };
  }, []);

  const CurrentCursor = CURSORS_CONFIG[cursorType]?.component || DefaultCursor;

  if (!isVisible) return null;

  return (
    <>
      <CurrentCursor isDarkTheme={isDarkTheme} />
      
      {showCursorMenu && (
        <div className={`cursor-menu ${isDarkTheme ? 'dark-theme' : ''}`}>
          <div className="cursor-menu-content">
            <div className="menu-header">
              <h3>🎮 ВЫБОР КУРСОРА</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCursorMenu(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="theme-indicator">
              ТЕМА: {isDarkTheme ? '🔴 ТЁМНАЯ' : '🟢 СВЕТЛАЯ'}
            </div>
            
            <div className="current-cursor-info">
              Текущий: <strong>{CURSORS_CONFIG[cursorType]?.name}</strong>
            </div>

            <div className="cursor-options">
              {Object.entries(CURSORS_CONFIG).map(([key, cursor], index) => (
                <button
                  key={key}
                  className={`cursor-option ${cursorType === key ? 'active' : ''}`}
                  onClick={() => {
                    setCursorType(key);
                    setShowCursorMenu(false);
                    if (addSystemMessage) {
                      addSystemMessage(`КУРСОР ИЗМЕНЕН: ${cursor.name}`, 'info');
                    }
                  }}
                >
                  <span className="cursor-name">{cursor.name}</span>
                  <span className="cursor-description">{cursor.description}</span>
                  <span className="cursor-hotkey">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>

            <div className="cursor-hotkeys">
              <div>⌨️ Горячие клавиши:</div>
              <div>1-5 - переключение курсоров</div>
              <div>0 - это меню</div>
            </div>
          </div>
        </div>
      )}

      <div className={`cursor-indicator ${isDarkTheme ? 'dark' : 'light'}`}>
        {CURSORS_CONFIG[cursorType]?.name}
      </div>
    </>
  );
};

export default CursorManager;