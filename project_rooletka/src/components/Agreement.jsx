import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import '../styles/Agreement.css';
import '../styles/EnhancedGlow.css';

const Agreement = ({ onAgree }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [corruptionLevel, setCorruptionLevel] = useState(0);
  const [glitchText, setGlitchText] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [kernelText, setKernelText] = useState('');
  const containerRef = useRef();
  const buttonRef = useRef();
  const kernelRef = useRef();

  const systemMessages = [
    "INITIALIZING SYSTEM TRANSFER...",
    "MEMORY CORRUPTION DETECTED: 98.7%",
    "LOADING KERNEL MODULES...",
    "ERROR: FILE SYSTEM INTEGRITY FAILURE",
    "MOUNTING EMERGENCY PROTOCOLS...",
    "WARNING: DATA LOSS IMMINENT",
    "ACTIVATING TRANSFER SEQUENCE...",
    "BYTE STREAM TRANSFER IN PROGRESS...",
    "SYSTEM INTEGRITY COMPROMISED",
    "REDIRECTING TO QUOTE ARCHIVER...",
    "USER_AGREEMENT: ACCEPTED", 
    "TRANSFER COMPLETE - READY FOR REDIRECTION"
  ];

  const glitchPhrases = [
    "ОШИБКА_ЧТЕНИЯ_СЕКТОРА",
    "ПОВРЕЖДЕННЫЙ_ФАЙЛ", 
    "НЕВОССТАНАВЛИВАЕМЫЕ_ДАННЫЕ",
    "КОРРУПЦИЯ_ПАМЯТИ",
    "ЦЕЛОСТНОСТЬ_НАРУШЕНА"
  ];

  const startGasolineEffect = useCallback(() => {
    const drips = document.querySelectorAll('.gasoline-drip');
    const puddle = document.querySelector('.gasoline-puddle');
    
    if (drips.length > 0) {
      gsap.to(drips, {
        scaleY: 1,
        opacity: 0.8,
        duration: 1.5,
        stagger: 0.1
      });
    }

    if (puddle) {
      gsap.to(puddle, {
        scaleY: 1,
        opacity: 0.6,
        duration: 2
      });
    }
  }, []);

  useEffect(() => {
    const corruptionInterval = setInterval(() => {
      setCorruptionLevel(prev => Math.min(prev + 0.02, 1));
    }, 1000);

    const glitchInterval = setInterval(() => {
      setGlitchText(glitchPhrases[Math.floor(Math.random() * glitchPhrases.length)]);
    }, 2000);

    return () => {
      clearInterval(corruptionInterval);
      clearInterval(glitchInterval);
    };
  }, [glitchPhrases]);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 2 }
      );
    }
  }, []);

  const handleAgreeClick = useCallback(() => {
    if (isButtonDisabled || isTransitioning) return;
    
    setIsButtonDisabled(true);
    
    const buttonElement = buttonRef.current;
    if (buttonElement) {
      gsap.to(buttonElement, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        onComplete: () => {
          setCorruptionLevel(1);
          startGasolineEffect();
          setTimeout(() => setIsTransitioning(true), 800);
        }
      });
    } else {
      setCorruptionLevel(1);
      startGasolineEffect();
      setTimeout(() => setIsTransitioning(true), 800);
    }
  }, [isButtonDisabled, isTransitioning, startGasolineEffect]);

  useEffect(() => {
    if (!isTransitioning) return;

    let animationFrameId;
    let animationComplete = false;
    const startTime = Date.now();
    const duration = 3000;
    const fullText = systemMessages.join('\n');
    
    const animateText = () => {
      if (animationComplete) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const charsToShow = Math.floor(fullText.length * easedProgress);
      
      setKernelText(fullText.substring(0, charsToShow));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateText);
      } else {
        animationComplete = true;
        setKernelText(fullText);
        
        setTimeout(() => {
          if (onAgree) onAgree();
        }, 500);
      }
    };
    
    animateText();

    return () => {
      animationComplete = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isTransitioning, onAgree]);

  return (
    <div 
      ref={containerRef}
      className="corrupted-file"
      style={{ '--corruption-level': corruptionLevel }}
    >
      {/* Остальная разметка без изменений */}
      <div className="gasoline-effects">
        <div className="gasoline-puddle"></div>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="gasoline-drip"
            style={{
              left: `${15 + i * 14}%`,
              height: `${40 + Math.random() * 60}%`
            }}
          />
        ))}
      </div>

      <div className="data-corruption-layer"></div>
      <div className="memory-leak"></div>
      <div className="binary-rain"></div>
      
      <div className="file-fragmentation">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="data-fragment"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      <div className="corrupted-content">
        <motion.div 
          className="file-header"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <div className="corrupted-title">
            <span className="title-layer base">ПОВРЕЖДЕННЫЙ ФАЙЛ</span>
            <span className="title-layer glitch-1">ПОВРЕЖДЕННЫЙ ФАЙЛ</span>
          </div>
          
          <div className="file-meta">
            <span className="meta-item">СТАТУС: КОРРУПЦИЯ</span>
            <span className="meta-item">ЦЕЛОСТНОСТЬ: {Math.round(100 - corruptionLevel * 100)}%</span>
            <span className="meta-item">СИСТЕМА: АКТИВНА</span>
          </div>
        </motion.div>

        <motion.div 
          className="corruption-warning"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="warning-header">▓▓▓ СИСТЕМНОЕ ПРЕДУПРЕЖДЕНИЕ ▓▓▓</div>
          
          <div className="error-list">
            <div className="error-item">
              <span className="error-code">0x7F3A1C</span>
              <span className="error-desc">- НАРУШЕНИЕ ЦЕЛОСТНОСТИ ДАННЫХ</span>
            </div>
            <div className="error-item">
              <span className="error-code">0x4B2E9F</span>
              <span className="error-desc">- НЕВОССТАНАВЛИВАЕМАЯ КОРРУПЦИЯ</span>
            </div>
          </div>

          <div className="data-loss-notice">
            ⚠️ ВОССТАНОВЛЕНИЕ ДАННЫХ НЕВОЗМОЖНО
          </div>
        </motion.div>

        {!isTransitioning && (
          <motion.button
            ref={buttonRef}
            className="neon-glitch-button enhanced-glow glow-green glow-button agreement-button"
            onClick={handleAgreeClick}
            disabled={isButtonDisabled}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="glow-text">
              {isButtonDisabled ? 'АКТИВАЦИЯ...' : 'ПРИНЯТЬ СОГЛАШЕНИЕ'}
            </span>
          </motion.button>
        )}

        <div className="floating-glitch">
          {glitchText}
        </div>

        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              ref={kernelRef}
              className="system-crash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="crash-screen">
                <div className="kernel-panic">
                  ⚡ SYSTEM TRANSFER PROTOCOL ⚡
                </div>

                <div className="kernel-terminal">
                  <pre className="terminal-text">
                    {kernelText}
                    <span className="typewriter-cursor">|</span>
                  </pre>
                </div>

                <div className="transfer-status">
                  {kernelText.includes('COMPLETE') ? '✅ READY' : '🔄 PROCESSING...'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="corruption-status">
        <div className="status-bar">
          <motion.div 
            className="corruption-progress"
            initial={{ width: 0 }}
            animate={{ width: `${corruptionLevel * 100}%` }}
          />
        </div>
        <div className="status-text">
          УРОВЕНЬ КОРРУПЦИИ: {Math.round(corruptionLevel * 100)}%
        </div>
      </div>
    </div>
  );
};

export default Agreement;