import { useCallback, useRef } from 'react'
import { gsap } from 'gsap'

export const useCursor = () => {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const lastPosition = useRef({ x: -100, y: -100 })
  const isInitialized = useRef(false)

  const initializeCursor = useCallback((element) => {
    if (!element || isInitialized.current) return
    
    gsap.set(element, {
      x: lastPosition.current.x,
      y: lastPosition.current.y,
      opacity: 0
    })
    
    isInitialized.current = true
  }, [])

  const updateCursorPosition = useCallback((x, y, element, options = {}) => {
    if (!element) return

    const { 
      duration = 0.1, 
      ease = "power2.out",
      immediate = false 
    } = options

    lastPosition.current = { x, y }

    if (immediate) {
      gsap.set(element, { 
        x, 
        y, 
        opacity: 1,
        overwrite: true
      })
    } else {
      gsap.to(element, {
        x,
        y,
        opacity: 1,
        duration,
        ease,
        overwrite: true
      })
    }
  }, [])

  const hideCursor = useCallback((element) => {
    if (!element) return
    gsap.to(element, {
      opacity: 0,
      duration: 0.2,
      overwrite: true
    })
  }, [])

  return {
    cursorRef,
    followerRef,
    lastPosition,
    initializeCursor,
    updateCursorPosition,
    hideCursor
  }
}