import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

const PulseCursor = ({ isDarkTheme = false }) => {
  const cursorRef = useRef(null)
  const pulseRef = useRef(null)
  const animationRef = useRef(null)

  const colors = {
    light: {
      core: '#00ff00',
      pulse: '#00ffff',
      glow: '#00ff00'
    },
    dark: {
      core: '#ff0000',
      pulse: '#ff0066',
      glow: '#ff0000'
    }
  }

  const currentColors = isDarkTheme ? colors.dark : colors.light

  const startPulseAnimation = useCallback(() => {
    if (!pulseRef.current) return

    animationRef.current = gsap.to(pulseRef.current, {
      scale: 2,
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    })
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!cursorRef.current || !pulseRef.current) return

    const { clientX, clientY } = e

    gsap.to(cursorRef.current, {
      x: clientX,
      y: clientY,
      duration: 0.1,
      overwrite: true
    })

    gsap.to(pulseRef.current, {
      x: clientX,
      y: clientY,
      duration: 0.3,
      overwrite: true
    })
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    startPulseAnimation()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [handleMouseMove, startPulseAnimation])

  return (
    <>
      <div
        ref={cursorRef}
        className="pulse-cursor-core"
        style={{
          position: 'fixed',
          width: '8px',
          height: '8px',
          background: currentColors.core,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: `0 0 20px ${currentColors.glow}`,
          mixBlendMode: isDarkTheme ? 'normal' : 'difference'
        }}
      />
      
      <div
        ref={pulseRef}
        className="pulse-cursor-ring"
        style={{
          position: 'fixed',
          width: '30px',
          height: '30px',
          border: `2px solid ${currentColors.pulse}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0.7,
          boxShadow: `0 0 15px ${currentColors.pulse}`
        }}
      />
    </>
  )
}

export default PulseCursor