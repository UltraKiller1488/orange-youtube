import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

const TraceCursor = ({ isDarkTheme = false }) => {
  const cursorRef = useRef(null)
  const trailRef = useRef([])
  const positionsRef = useRef([])

  const colors = {
    light: {
      primary: '#00ff00',
      secondary: '#00ffff',
      trail: '#00ff00'
    },
    dark: {
      primary: '#ff0000', 
      secondary: '#ff0066',
      trail: '#ff0000'
    }
  }

  const currentColors = isDarkTheme ? colors.dark : colors.light

  const handleMouseMove = useCallback((e) => {
    if (!cursorRef.current) return

    const { clientX, clientY } = e

    gsap.to(cursorRef.current, {
      x: clientX,
      y: clientY,
      duration: 0.1,
      overwrite: true
    })

    positionsRef.current.push({ x: clientX, y: clientY })
    
    if (positionsRef.current.length > 8) {
      positionsRef.current.shift()
    }

    createTrailPoint(clientX, clientY)
  }, [])

  const createTrailPoint = useCallback((x, y) => {
    const point = document.createElement('div')
    const size = 3 + Math.random() * 4
    
    point.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${currentColors.trail};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      opacity: 0.8;
      box-shadow: 0 0 8px ${currentColors.trail};
      will-change: transform, opacity;
    `

    document.body.appendChild(point)
    trailRef.current.push(point)

    gsap.to(point, {
      duration: 0.8,
      scale: 0,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => {
        if (point.parentNode) {
          point.parentNode.removeChild(point)
          trailRef.current = trailRef.current.filter(p => p !== point)
        }
      }
    })
  }, [currentColors])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      trailRef.current.forEach(point => {
        if (point.parentNode) point.parentNode.removeChild(point)
      })
      trailRef.current = []
    }
  }, [handleMouseMove])

  return (
    <div
      ref={cursorRef}
      className="trace-cursor"
      style={{
        position: 'fixed',
        width: '6px',
        height: '6px',
        background: currentColors.primary,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        boxShadow: `0 0 15px ${currentColors.primary}, 0 0 30px ${currentColors.secondary}`,
        mixBlendMode: isDarkTheme ? 'normal' : 'difference'
      }}
    />
  )
}

export default TraceCursor