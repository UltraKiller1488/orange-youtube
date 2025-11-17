import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const LiquidCursor = () => {
  const cursorRef = useRef(null)
  const blobRef = useRef(null)

  useEffect(() => {
    if (!cursorRef.current || !blobRef.current) return

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e

      gsap.to(cursorRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.1
      })

      gsap.to(blobRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      })

      gsap.to(blobRef.current, {
        attr: {
          d: generateBlobPath(clientX, clientY)
        },
        duration: 0.5,
        ease: "power2.out"
      })
    }

    const generateBlobPath = (x, y) => {
      const numPoints = 8
      const radius = 15
      let path = `M ${x + radius} ${y}`

      for (let i = 1; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2
        const pointRadius = radius + Math.random() * 10 - 5
        const pointX = x + Math.cos(angle) * pointRadius
        const pointY = y + Math.sin(angle) * pointRadius
        path += ` L ${pointX} ${pointY}`
      }

      path += ' Z'
      return path
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: '6px',
          height: '6px',
          background: '#00ff00',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
      <svg
        ref={blobRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9998,
          filter: 'url(#goo)'
        }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </>
  )
}

export default LiquidCursor;