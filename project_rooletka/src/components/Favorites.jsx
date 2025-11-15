import { motion } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import '../styles/Favorites.css'

const Favorites = ({ favorites }) => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 }
  })

  if (favorites.length === 0) {
    return (
      <animated.div className="favorites-empty" style={fadeIn}>
        <div className="glitch-text" data-text="ПУСТОТА ВНУТРИ">
          ПУСТОТА ВНУТРИ
        </div>
        <p>Здесь появятся протоколы боли</p>
      </animated.div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  return (
    <motion.div 
      className="favorites-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="favorites-title">АРХИВ БОЛИ</h2>
      <div className="favorites-grid">
        {favorites.map((fav, index) => (
          <motion.div 
            key={fav.id}
            className="favorite-card"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 20px rgba(139, 0, 0, 0.5)"
            }}
          >
            <img src={fav.image} alt="protocol background" />
            <div className="blood-stain"></div>
            <div className="favorite-content">
              <p className="favorite-text">{fav.text}</p>
              <span className="favorite-author">{fav.author}</span>
              <div className="protocol-meta">
                <span className="protocol-id">ПРОТОКОЛ #{fav.id}</span>
                <span className="pain-level">БОЛЬ: {Math.random() * 100 | 0}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default Favorites