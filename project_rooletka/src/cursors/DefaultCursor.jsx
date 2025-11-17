import { useEffect, useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import { useCursor } from '../hooks/useCursor'

const DefaultCursor = ({ isDarkTheme = false }) => {
  const { 
    cursorRef, 
    followerRef,
    initializeCursor, 
    updateCursorPosition,
    hideCursor 
  } = useCursor()

  const isActive = useRef(false)

  const colors = {
    light: {
      cursor: '#00ff00',
      followerBorder: '#00ff00'
    },
    dark: {
      cursor: '#ff0000',
      followerBorder: '#ff0000'
    }
  }

  const currentColors = isDarkTheme ? colors.dark : colors.light

  const handleMouseMove = useCallback((e) => {
    if (!cursorRef.current || !followerRef.current) return

    const { clientX, clientY } = e
    
    updateCursorPosition(clientX, clientY, cursorRef.current, {
      immediate: true
    })

    updateCursorPosition(clientX, clientY, followerRef.current, {
      duration: 0.3,
      ease: "power2.out"
    })
  }, [cursorRef, followerRef, updateCursorPosition])

  const handleMouseEnter = useCallback(() => {
    isActive.current = true
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 })
    }
    if (followerRef.current) {
      gsap.to(followerRef.current, { opacity: 1, duration: 0.2 })
    }
  }, [cursorRef, followerRef])

  const handleMouseLeave = useCallback(() => {
    isActive.current = false
    hideCursor(cursorRef.current)
    hideCursor(followerRef.current)
  }, [cursorRef, followerRef, hideCursor])

  useEffect(() => {
    initializeCursor(cursorRef.current)
    initializeCursor(followerRef.current)
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [initializeCursor, handleMouseMove, handleMouseEnter, handleMouseLeave])

  return (
    <>
      <div
        ref={cursorRef}
        className="default-cursor"
        style={{
          position: 'fixed',
          width: '4px',
          height: '4px',
          background: currentColors.cursor,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0
        }}
      />
      <div
        ref={followerRef}
        className="cursor-follower"
        style={{
          position: 'fixed',
          width: '20px',
          height: '20px',
          border: `2px solid ${currentColors.followerBorder}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0
        }}
      />
    </>
  )
}

export default DefaultCursor