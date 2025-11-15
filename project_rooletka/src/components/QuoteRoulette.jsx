import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { gsap } from 'gsap'
import '../styles/QuoteRoulette.css'

const quotes = [
  {
    id: 1,
    text: "Реальность — это всего лишь иллюзия, хотя и очень стойкая",
    author: "Альберт Эйнштейн",
    image: "/images/quote1.jpg",
    short: "ИЛЛЮЗИЯ"
  },
  {
    id: 2,
    text: "Темнота не существует, это просто отсутствие света",
    author: "Неизвестно",
    image: "/images/quote2.jpg",
    short: "ТЕМНОТА"
  },
  {
    id: 3,
    text: "Сознание — это единственная реальность",
    author: "Теренс Маккена",
    image: "/images/quote1.jpg",
    short: "СОЗНАНИЕ"
  },
  {
    id: 4,
    text: "Всё, что ты видишь, есть твое отражение",
    author: "Будда",
    image: "/images/quote2.jpg",
    short: "ОТРАЖЕНИЕ"
  },
  {
    id: 5,
    text: "Безумие — это повторять одно и то же и ожидать разных результатов",
    author: "Альберт Эйнштейн",
    image: "/images/quote1.jpg",
    short: "БЕЗУМИЕ"
  },
  {
    id: 6,
    text: "Мы есть то, что мы думаем",
    author: "Будда",
    image: "/images/quote2.jpg",
    short: "МЫСЛЬ"
  }
]

const QuoteRoulette = ({ onAddToFavorites }) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const wheelRef = useRef()
  const quoteCardRef = useRef()

  // React Spring для вращения колеса
  const [spring, setSpring] = useSpring(() => ({
    rotate: 0,
    config: { tension: 200, friction: 30 }
  }))

  const spinWheel = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    const spins = 5
    const randomIndex = Math.floor(Math.random() * quotes.length)
    const degreesPerItem = 360 / quotes.length
    const targetRotation = 360 * spins + (randomIndex * degreesPerItem)

    // GSAP эффекты для карточки
    gsap.to(quoteCardRef.current, {
      scale: 0.9,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    })

    // Анимация вращения через React Spring
    setSpring.start({ rotate: -targetRotation })

    setTimeout(() => {
      setCurrentQuote(quotes[randomIndex])
      setIsSpinning(false)
    }, 3000)
  }

  const resetWheel = () => {
    setSpring.start({ rotate: 0 })
  }

  const quoteCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  }

  return (
    <div className="roulette-container">
      <div className="wheel-section">
        <div className="wheel-container">
          <div className="wheel-wrapper">
            <animated.div 
              ref={wheelRef}
              className="wheel"
              style={{ 
                transform: spring.rotate.to(r => `rotate(${r}deg)`)
              }}
            >
              {quotes.map((quote, index) => (
                <div 
                  key={quote.id}
                  className="wheel-item"
                  style={{ 
                    transform: `rotate(${index * (360 / quotes.length)}deg)`
                  }}
                >
                  <div className="wheel-text">
                    {quote.short}
                  </div>
                </div>
              ))}
            </animated.div>
            <div className="wheel-center"></div>
            <div className="wheel-pointer"></div>
          </div>
        </div>
      </div>

      <div className="current-quote">
        <motion.div 
          ref={quoteCardRef}
          className="quote-card"
          key={currentQuote.id}
          variants={quoteCardVariants}
          initial="hidden"
          animate="visible"
        >
          <img 
            src={currentQuote.image} 
            alt="background"
            className="quote-image"
          />
          <div className="glitch-overlay"></div>
          <div className="quote-content">
            <p className="quote-text">{currentQuote.text}</p>
            <p className="quote-author">— {currentQuote.author}</p>
          </div>
        </motion.div>

        <div className="controls">
          <motion.button
            className="spin-btn"
            onClick={spinWheel}
            disabled={isSpinning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSpinning ? '...ВРАЩЕНИЕ...' : 'КРУТИТЬ РУЛЕТКУ'}
          </motion.button>
          
          <motion.button
            className="favorite-btn"
            onClick={() => onAddToFavorites(currentQuote)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ♡ СОХРАНИТЬ
          </motion.button>

          <motion.button
            className="reset-btn"
            onClick={resetWheel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            СБРОС
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default QuoteRoulette