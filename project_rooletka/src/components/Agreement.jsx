import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpring, animated, config } from '@react-spring/web'
import { gsap } from 'gsap'
import ThreeJSBackground from './ThreeJSBackground'
import { useCombinedAnimations } from '../hooks/useCombinedAnimations'
import '../styles/Agreement.css'

const Agreement = ({ onAgree }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [corruptionLevel, setCorruptionLevel] = useState(0)
  const [glitchText, setGlitchText] = useState('')
  const containerRef = useRef()
  const dataStreamRef = useRef()
  const buttonRef = useRef()
  const { glitchEffect, corruptionWave, dataStreamEffect } = useCombinedAnimations()

  // React Spring для плавных числовых анимаций
  const springProps = useSpring({
    corruption: corruptionLevel,
    from: { corruption: 0 },
    config: config.molasses
  })

  // Framer Motion для сложных последовательностей
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 2,
        staggerChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      filter: "blur(10px) hue-rotate(90deg)",
      transition: { duration: 2 }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 2 }
    }
  }

  // GSAP для постоянных глитч-эффектов
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      // Добавляем проверку существования элементов
      const glitch1 = document.querySelector('.title-layer.glitch-1')
      const glitch2 = document.querySelector('.title-layer.glitch-2')
      
      if (glitch1) glitchEffect('.title-layer.glitch-1', 1)
      if (glitch2) glitchEffect('.title-layer.glitch-2', 0.7)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [glitchEffect])

  // Инициализация эффектов
  useEffect(() => {
    const glitchPhrases = [
      "ОШИБКА_ЧТЕНИЯ_СЕКТОРА",
      "ПОВРЕЖДЕННЫЙ_ФАЙЛ",
      "НЕВОССТАНАВЛИВАЕМЫЕ_ДАННЫЕ",
      "КОРРУПЦИЯ_ПАМЯТИ",
      "ЦЕЛОСТНОСТЬ_НАРУШЕНА",
      "ДОСТУП_ЗАПРЕЩЕН",
      "СИСТЕМНЫЙ_СБОЙ"
    ]

    const interval = setInterval(() => {
      setGlitchText(glitchPhrases[Math.floor(Math.random() * glitchPhrases.length)])
      setCorruptionLevel(prev => Math.min(prev + 0.05, 1))
    }, 2000)

    // Анимация фрагментов данных с проверкой
    const dataFragments = document.querySelectorAll('.data-fragment')
    if (dataFragments.length > 0) {
      gsap.to('.data-fragment', {
        y: "+=100vh",
        rotation: 360,
        duration: () => gsap.utils.random(5, 15),
        repeat: -1,
        ease: "none",
        stagger: 0.1
      })
    }

    return () => clearInterval(interval)
  }, [])

  const handleAgreeClick = () => {
    setCorruptionLevel(1)
    setIsTransitioning(true)
    
    // Каскадный сбой с GSAP с проверкой элементов
    const metaItems = document.querySelectorAll('.meta-item')
    if (metaItems.length > 0) {
      gsap.to('.meta-item', {
        y: -100,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.in"
      })
    }

    const errorItems = document.querySelectorAll('.error-item')
    if (errorItems.length > 0) {
      corruptionWave(errorItems, 0.5)
    }

    setTimeout(() => {
      onAgree()
    }, 3000)
  }

  const handleButtonHover = () => {
    setIsHovering(true)
    glitchEffect('.recover-button', 2)
    
    // Используем ref вместо поиска по селектору
    if (dataStreamRef.current) {
      dataStreamEffect(dataStreamRef.current)
    }
  }

  const SpringAnimatedMetaItem = ({ text, delay }) => {
    const props = useSpring({
      from: { opacity: 0, scale: 0.8, x: -50 },
      to: { opacity: 1, scale: 1, x: 0 },
      delay,
      config: config.wobbly
    })

    return (
      <animated.span className="meta-item" style={props}>
        {text}
      </animated.span>
    )
  }

  return (
    <motion.div 
      ref={containerRef}
      className={`corrupted-file ${isHovering ? 'cursor-gone' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ '--corruption-level': springProps.corruption }}
    >
      <ThreeJSBackground corruptionLevel={corruptionLevel} />
      
      {/* Фоновые слои коррупции */}
      <div className="data-corruption-layer"></div>
      <div className="memory-leak"></div>
      <div className="sector-errors"></div>
      <div className="binary-rain"></div>
      
      {/* Фрагменты данных */}
      <div className="file-fragmentation">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="data-fragment"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {Math.random().toString(36).substring(2, 8).toUpperCase()}
          </div>
        ))}
      </div>

      {/* Основной контент */}
      <div className="corrupted-content">
        <motion.div className="file-header" variants={itemVariants}>
          <div className="corrupted-title">
            <span className="title-layer base">ПОВРЕЖДЕННЫЙ ФАЙЛ</span>
            <span className="title-layer glitch-1">ПОВРЕЖДЕННЫЙ ФАЙЛ</span>
            <span className="title-layer glitch-2">ПОВРЕЖДЕННЫЙ ФАЙЛ</span>
          </div>
          
          <div className="file-meta">
            <SpringAnimatedMetaItem text="РАЗМЕР: ??? БАЙТ" delay={0} />
            <SpringAnimatedMetaItem text="ДАТА: --:--:----" delay={200} />
            <SpringAnimatedMetaItem text="СТАТУС: КОРРУПЦИЯ" delay={400} />
          </div>
        </motion.div>

        <motion.div className="corruption-warning" variants={itemVariants}>
          <div className="warning-header">▓▓▓ СИСТЕМНОЕ ПРЕДУПРЕЖДЕНИЕ ▓▓▓</div>
          
          <div className="error-list">
            {[
              { code: "0x7F3A1C", desc: "НАРУШЕНИЕ ЦЕЛОСТНОСТИ ДАННЫХ" },
              { code: "0x4B2E9F", desc: "НЕВОССТАНАВЛИВАЕМАЯ КОРРУПЦИЯ" },
              { code: "0x8C5D7A", desc: "УТЕЧКА ПАМЯТИ ОБНАРУЖЕНА" },
              { code: "0x1A6F4E", desc: "ДОСТУП К СЕКТОРУ ЗАБЛОКИРОВАН" }
            ].map((error, index) => (
              <motion.div
                key={error.code}
                className="error-item"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.2 }}
              >
                <span className="error-code">{error.code}</span>
                <span className="error-desc">- {error.desc}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="data-loss-notice"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: "spring" }}
          >
            ⚠️ ВОССТАНОВЛЕНИЕ ДАННЫХ НЕВОЗМОЖНО
            <br />
            ⚠️ ПРОДОЛЖЕНИЕ МОЖЕТ ПРИВЕСТИ К НЕОБРАТИМЫМ ИЗМЕНЕНИЯМ
          </motion.div>
        </motion.div>

        <motion.button
          ref={buttonRef}
          className="recover-button"
          onClick={handleAgreeClick}
          onMouseEnter={handleButtonHover}
          onMouseLeave={() => setIsHovering(false)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="button-corruption"></div>
          <span className="button-text">ПОПЫТКА ВОССТАНОВЛЕНИЯ</span>
          <div className="button-glitch"></div>
          <span className="button-warning">!</span>
        </motion.button>

        <AnimatePresence>
          {isHovering && (
            <motion.div
              ref={dataStreamRef}
              className="data-stream"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              exit={{ width: 0 }}
            />
          )}
        </AnimatePresence>

        <div className="floating-glitch">
          {glitchText}
        </div>

        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="system-crash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="crash-screen">
                <div className="kernel-panic">KERNEL PANIC</div>
                <div className="stack-trace">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="trace-line">
                      [0x{((i + 1) * 0x1000).toString(16).toUpperCase()}] {Math.random().toString(36).substring(2, 10).toUpperCase()}
                    </div>
                  ))}
                </div>
                <div className="fatal-error">
                  FATAL SYSTEM ERROR: MEMORY CORRUPTION DETECTED
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
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="status-text">
          УРОВЕНЬ КОРРУПЦИИ: {Math.round(corruptionLevel * 100)}%
          {corruptionLevel > 0.5 && " ⚠️ КРИТИЧЕСКИЙ"}
          {corruptionLevel > 0.8 && " 💀 НЕОБРАТИМЫЙ"}
        </div>
      </div>

      <div className="hex-stream">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="hex-line"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          >
            {Array.from({ length: 15 }, () => 
              Math.random().toString(16).substring(2, 4).toUpperCase()
            ).join(' ')}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default Agreement