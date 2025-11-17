import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isHidden, setIsHidden] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!cursorRef.current || !followerRef.current) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const updateCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseMove = (e) => {
      updateCursor(e);
      
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
      });

      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      
      gsap.to(follower, {
        x: followerX,
        y: followerY,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
      gsap.to([cursor, follower], {
        opacity: 1,
        scale: 1,
        duration: 0.3
      });
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
      gsap.to([cursor, follower], {
        opacity: 0,
        scale: 0,
        duration: 0.3
      });
    };

    const handleMouseDown = () => {
      setIsActive(true);
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1
      });
      gsap.to(follower, {
        scale: 1.2,
        borderWidth: "1px",
        duration: 0.1
      });
    };

    const handleMouseUp = () => {
      setIsActive(false);
      gsap.to(cursor, {
        scale: 1,
        duration: 0.1
      });
      gsap.to(follower, {
        scale: 1,
        borderWidth: "2px",
        duration: 0.1
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.classList.contains('nav-btn') ||
        target.classList.contains('control-btn') ||
        target.classList.contains('favorite-card') ||
        target.classList.contains('clickable')
      ) {
        setIsPointer(true);
        gsap.to(follower, {
          scale: 1.5,
          borderColor: '#00ffff',
          backgroundColor: 'rgba(0, 255, 255, 0.1)',
          duration: 0.3
        });
        gsap.to(cursor, {
          backgroundColor: '#00ffff',
          duration: 0.3
        });
      } else {
        setIsPointer(false);
        gsap.to(follower, {
          scale: 1,
          borderColor: '#00ff00',
          backgroundColor: 'transparent',
          duration: 0.3
        });
        gsap.to(cursor, {
          backgroundColor: '#00ff00',
          duration: 0.3
        });
      }
    };

    const isTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    if (!isTouchDevice()) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseenter', handleMouseEnter);
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseover', handleMouseOver);

      gsap.set([cursor, follower], {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    } else {
      setIsHidden(true);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  useEffect(() => {
    if (!followerRef.current || isHidden) return;

    const createParticle = () => {
      if (!followerRef.current || isHidden) return;

      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #00ff00;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        left: ${followerRef.current.offsetLeft + 12}px;
        top: ${followerRef.current.offsetTop + 12}px;
      `;

      document.body.appendChild(particle);

      gsap.to(particle, {
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
        opacity: 0,
        scale: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }
      });
    };

    if (isPointer && !isHidden) {
      const particleInterval = setInterval(() => {
        createParticle();
      }, 100);

      return () => clearInterval(particleInterval);
    }
  }, [isPointer, isHidden]);

  if (isHidden) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${isPointer ? 'pointer' : ''} ${isActive ? 'active' : ''}`}
      />
      
      <div
        ref={followerRef}
        className={`cursor-follower ${isPointer ? 'pointer' : ''} ${isActive ? 'active' : ''}`}
      />
    </>
  );
};

export default CustomCursor;