import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuoteRoulette from './QuoteRoulette.jsx'
import Favorites from './Favorites.jsx'
import '../styles/Main.css'

const Main = () => {
  const [currentTab, setCurrentTab] = useState('roulette')
  const [favorites, setFavorites] = useState([])

  const addToFavorites = useCallback((quote) => {
    setFavorites(prev => [...prev, { ...quote, id: Date.now() }])
  }, [])

  const tabContentVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } }
  }

  return (
    <div className="main-container">
      <nav className="glitch-nav">
        <motion.button 
          className={currentTab === 'roulette' ? 'active' : ''}
          onClick={() => setCurrentTab('roulette')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          РУЛЕТКА
        </motion.button>
        <motion.button 
          className={currentTab === 'favorites' ? 'active' : ''}
          onClick={() => setCurrentTab('favorites')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ИЗБРАННОЕ ({favorites.length})
        </motion.button>
      </nav>

      <AnimatePresence mode="wait">
        {currentTab === 'roulette' ? (
          <motion.div
            key="roulette"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <QuoteRoulette onAddToFavorites={addToFavorites} />
          </motion.div>
        ) : (
          <motion.div
            key="favorites"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Favorites favorites={favorites} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Main