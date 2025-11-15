import { useRef } from 'react'
import { gsap } from 'gsap'

export const useCombinedAnimations = () => {
  const tl = useRef(gsap.timeline())

  const glitchEffect = (targets, intensity = 1) => {
    const elements = gsap.utils.toArray(targets)
    if (elements.length === 0) {
      console.warn(`GSAP: Elements not found for selector: ${targets}`)
      return null
    }

    return gsap.to(elements, {
      x: () => gsap.utils.random(-5 * intensity, 5 * intensity),
      y: () => gsap.utils.random(-5 * intensity, 5 * intensity),
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      ease: "power1.inOut"
    })
  }

  const corruptionWave = (elements, delay = 0) => {
    if (!elements || elements.length === 0) {
      console.warn('GSAP: No elements provided for corruption wave')
      return
    }

    elements.forEach((el, index) => {
      if (el) {
        gsap.to(el, {
          scale: 1.2,
          opacity: 0,
          duration: 0.5,
          delay: delay + (index * 0.1),
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        })
      }
    })
  }

  const dataStreamEffect = (element, duration = 2) => {
    if (!element) {
      console.warn('GSAP: Element not found for data stream effect')
      return null
    }

    return gsap.fromTo(element,
      { x: "-100%", opacity: 0 },
      { x: "100%", opacity: 1, duration, ease: "power2.inOut" }
    )
  }

  return {
    glitchEffect,
    corruptionWave,
    dataStreamEffect,
    timeline: tl.current
  }
}