import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

const GlitchInteraction = ({ onRandomThemeSwitch, onScreamerActivate, isScreamerActive }) => {
  const effectsContainerRef = useRef();

  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'vhs-effects-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 500;
    `;
    document.body.appendChild(container);
    effectsContainerRef.current = container;

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  const createVHSEffect = useCallback((x, y) => {
    if (!effectsContainerRef.current || isScreamerActive) return;

    const container = effectsContainerRef.current;

    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        circle at ${x}px ${y}px,
        rgba(255, 0, 255, 0.8) 0%,
        rgba(0, 255, 255, 0.6) 30%,
        transparent 70%
      );
      pointer-events: none;
      z-index: 10001;
      mix-blend-mode: screen;
    `;
    container.appendChild(flash);

    gsap.to(flash, {
      duration: 0.3,
      opacity: 0,
      scale: 1.5,
      ease: "power2.out",
      onComplete: () => flash.remove()
    });

    const noise = document.createElement('div');
    noise.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        repeating-linear-gradient(0deg, 
          rgba(255, 255, 255, 0.1) 0px, 
          rgba(255, 255, 255, 0.1) 1px, 
          transparent 1px, 
          transparent 2px
        ),
        repeating-linear-gradient(90deg, 
          rgba(255, 255, 255, 0.05) 0px, 
          rgba(255, 255, 255, 0.05) 1px, 
          transparent 1px, 
          transparent 2px
        );
      pointer-events: none;
      z-index: 10002;
      opacity: 0.7;
    `;
    container.appendChild(noise);

    gsap.to(noise, {
      duration: 0.5,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => noise.remove()
    });

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
          position: fixed;
          top: ${Math.random() * 100}%;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, 
            transparent, 
            #ff00ff, 
            #00ffff, 
            #ffff00, 
            transparent
          );
          pointer-events: none;
          z-index: 10003;
          opacity: 0.9;
          box-shadow: 0 0 20px #00ffff;
        `;
        container.appendChild(scanLine);

        gsap.to(scanLine, {
          duration: 0.4,
          opacity: 0,
          y: Math.random() * 100 - 50,
          ease: "power2.out",
          onComplete: () => scanLine.remove()
        });
      }, i * 100);
    }

    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    colors.forEach((color, index) => {
      const layer = document.createElement('div');
      layer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${color};
        pointer-events: none;
        z-index: 10004;
        opacity: 0.3;
        mix-blend-mode: overlay;
      `;
      container.appendChild(layer);

      gsap.to(layer, {
        duration: 0.2,
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        opacity: 0,
        delay: index * 0.05,
        ease: "power2.out",
        onComplete: () => layer.remove()
      });
    });

    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const char = document.createElement('div');
        char.textContent = Math.random() > 0.5 ? '1' : '0';
        char.style.cssText = `
          position: fixed;
          left: ${x + (Math.random() - 0.5) * 200}px;
          top: ${y + (Math.random() - 0.5) * 200}px;
          color: ${Math.random() > 0.5 ? '#ff00ff' : '#00ffff'};
          font-size: ${12 + Math.random() * 10}px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          pointer-events: none;
          z-index: 10005;
          opacity: 0;
          text-shadow: 0 0 10px currentColor;
        `;
        container.appendChild(char);

        gsap.to(char, {
          duration: 1.5,
          y: '+=150',
          opacity: 1,
          rotation: Math.random() * 360,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(char, {
              duration: 0.3,
              opacity: 0,
              onComplete: () => char.remove()
            });
          }
        });
      }, i * 50);
    }

    if (!isScreamerActive) {
      gsap.to('body', {
        duration: 0.1,
        x: 5,
        y: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          gsap.to('body', { duration: 0.1, x: 0, y: 0 });
        }
      });
    }

    console.log('VHS EFFECT TRIGGERED at:', x, y);
  }, [isScreamerActive]);

  const createHoverEffect = useCallback((element) => {
    if (!effectsContainerRef.current || isScreamerActive) return;

    const rect = element.getBoundingClientRect();
    const container = effectsContainerRef.current;

    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      left: ${rect.left - 3}px;
      top: ${rect.top - 3}px;
      width: ${rect.width + 6}px;
      height: ${rect.height + 6}px;
      border: 2px solid #00ff00;
      border-radius: inherit;
      pointer-events: none;
      z-index: 10006;
      opacity: 0;
      box-shadow: 0 0 20px #00ff00;
    `;
    container.appendChild(glow);

    gsap.to(glow, {
      duration: 0.3,
      opacity: 0.8,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(glow, {
          duration: 0.2,
          opacity: 0,
          onComplete: () => glow.remove()
        });
      }
    });
  }, [isScreamerActive]);

  useEffect(() => {
    const handleClick = (e) => {
      if (isScreamerActive) return;
      
      createVHSEffect(e.clientX, e.clientY);
      
      if (onRandomThemeSwitch && Math.random() < 0.3) {
        onRandomThemeSwitch();
      }
      
      if (onScreamerActivate && Math.random() < 0.1) {
        onScreamerActivate();
      }
    };

    const handleMouseEnter = (e) => {
      if (isScreamerActive) return;
      
      const target = e.target;
      if (target && typeof target.matches === 'function' && 
          target.matches('button, .nav-btn, .control-btn, .favorite-card')) {
        createHoverEffect(target);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('mouseenter', handleMouseEnter, true);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [createVHSEffect, createHoverEffect, onRandomThemeSwitch, onScreamerActivate, isScreamerActive]);

  return null;
};

export default GlitchInteraction;