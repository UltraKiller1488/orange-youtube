import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Particles = ({ count = 20, corruption = 0 }) => {
  const particlesRef = useRef();

  useEffect(() => {
    const particles = particlesRef.current;
    if (!particles) return;

    const particleElements = [];
    const types = ['binary', 'hex', 'glitch'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const type = types[Math.floor(Math.random() * types.length)];
      
      particle.className = `particle particle-${type}`;
      particle.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${0.1 + Math.random() * 0.3};
        font-size: ${0.6 + Math.random() * 0.8}rem;
        color: ${Math.random() > 0.5 ? '#00ff00' : '#00ffff'};
        pointer-events: none;
        z-index: 0;
        white-space: nowrap;
      `;

      if (type === 'binary') {
        particle.textContent = Array.from({ length: Math.random() * 10 + 5 }, 
          () => Math.random() > 0.5 ? '1' : '0'
        ).join('');
      } else if (type === 'hex') {
        particle.textContent = Array.from({ length: Math.random() * 8 + 4 }, 
          () => Math.random().toString(16).substring(2, 4).toUpperCase()
        ).join(' ');
      } else {
        particle.textContent = ['ERROR', 'CORRUPT', 'FAIL', 'GLITCH'][Math.floor(Math.random() * 4)];
      }

      particles.appendChild(particle);
      particleElements.push(particle);

      gsap.to(particle, {
        y: `+=${100 + Math.random() * 200}px`,
        x: `+=${Math.random() * 100 - 50}px`,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 10 + Math.random() * 20,
        ease: "none",
        onComplete: () => {
          particle.remove();
        }
      });
    }

    return () => {
      particleElements.forEach(p => p.remove());
    };
  }, [count, corruption]);

  return <div ref={particlesRef} className="particles-container" />;
};

export default Particles;