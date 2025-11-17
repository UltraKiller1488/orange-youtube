import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlitchOverlay = ({ corruption = 0 }) => {
  const [glitches, setGlitches] = useState([]);

  useEffect(() => {
    const createGlitch = () => {
      if (Math.random() < 0.3 + corruption * 0.5) {
        const newGlitch = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          type: Math.floor(Math.random() * 3),
          size: 50 + Math.random() * 150
        };
        setGlitches(prev => [...prev.slice(-8), newGlitch]);
      }
    };

    const interval = setInterval(createGlitch, 300 + Math.random() * 700);
    return () => clearInterval(interval);
  }, [corruption]);

  return (
    <div className="glitch-overlay">
      <AnimatePresence>
        {glitches.map(glitch => (
          <motion.div
            key={glitch.id}
            className={`glitch-flash glitch-type-${glitch.type}`}
            style={{ 
              left: `${glitch.x}%`, 
              top: `${glitch.y}%`,
              width: `${glitch.size}px`,
              height: `${glitch.size}px`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0, 1, 1.5]
            }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GlitchOverlay;