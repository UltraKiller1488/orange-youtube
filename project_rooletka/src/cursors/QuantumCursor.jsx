import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

const QuantumCursor = ({ isDarkTheme = false }) => {
  const cursorRef = useRef(null)
  const particlesRef = useRef([])

  const colors = {
    light: {
      core: '#00ff00',
      particle1: '#00ffff',
      particle2: '#00ff00',
      glow: '#00ff00'
    },
    dark: {
      core: '#ff0000',
      particle1: '#ff0066',
      particle2: '#ff0000',
      glow: '#ff0000'
    }
  }

  const currentColors = isDarkTheme ? colors.dark : colors.light

  const createQuantumParticle = useCallback((x, y) => {
    const particle = document.createElement('div')
    const size = 2 + Math.random() * 4
    const isWave = Math.random() > 0.5
    
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${isWave ? currentColors.particle1 : currentColors.particle2};
      border-radius: ${isWave ? '0%' : '50%'};
      pointer-events: none;
      z-index: 9998;
      opacity: 0;
      box-shadow: 0 0 6px ${isWave ? currentColors.particle1 : currentColors.particle2};
      will-change: transform, opacity;
    `

    document.body.appendChild(particle)
    particlesRef.current.push(particle)

    const angle = Math.random() * Math.PI * 2
    const distance = 20 + Math.random() * 40
    const targetX = x + Math.cos(angle) * distance
    const targetY = y + Math.sin(angle) * distance

    gsap.to(particle, {
      x: targetX,
      y: targetY,
      opacity: 0.8,
      rotation: Math.random() * 360,
      duration: 0.5 + Math.random() * 0.5,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(particle, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
          onComplete: () => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle)
              particlesRef.current = particlesRef.current.filter(p => p !== particle)
            }
          }
        })
      }
    })
  }, [currentColors])

  const handleMouseMove = useCallback((e) => {
    if (!cursorRef.current) return

    const { clientX, clientY } = e

    gsap.to(cursorRef.current, {
      x: clientX,
      y: clientY,
      duration: 0.1,
      overwrite: true
    })

    if (Math.random() > 0.8) {
      createQuantumParticle(clientX, clientY)
    }
  }, [createQuantumParticle])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      particlesRef.current.forEach(particle => {
        if (particle.parentNode) particle.parentNode.removeChild(particle)
      })
      particlesRef.current = []
    }
  }, [handleMouseMove])

  return (
    <div
      ref={cursorRef}
      className="quantum-cursor"
      style={{
        position: 'fixed',
        width: '8px',
        height: '8px',
        background: currentColors.core,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        boxShadow: `0 0 15px ${currentColors.glow}`,
        mixBlendMode: isDarkTheme ? 'normal' : 'difference'
      }}
    />
  )
}

export default QuantumCursor