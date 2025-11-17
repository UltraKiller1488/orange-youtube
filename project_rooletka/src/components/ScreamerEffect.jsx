import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import '../styles/ScreamerEffect.css'

const ScreamerEffect = ({ isActive, onComplete, screamerType = 'normal' }) => {
  const containerRef = useRef()
  const inputRef = useRef()
  const transitionRef = useRef()
  const [userInput, setUserInput] = useState('')
  const typeIntervalRef = useRef(null)
  const [isDarkTerminalReady, setIsDarkTerminalReady] = useState(false)

  const darkTerminalLines = [
    "> INITIATING SYSTEM SCAN...",
    "> WARNING: UNAUTHORIZED ACCESS DETECTED",
    "> SECURITY BREACH IN PROGRESS", 
    "> MEMORY CORRUPTION: 87%",
    "> IDENTIFY YOURSELF:"
  ]

  const normalPhrases = [
    "⚠️ СИСТЕМНЫЙ СБОЙ ⚠️",
    "🚨 КРИТИЧЕСКАЯ ОШИБКА 🚨",
    "💀 ДОСТУП ЗАПРЕЩЕН 💀",
    "🔴 УГРОЗА ОБНАРУЖЕНА 🔴",
    "⚡ ПЕРЕГРУЗКА СИСТЕМЫ ⚡"
  ]

  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      if (isActive && screamerType === 'dark' && e.key === 'Enter') {
        console.log('⌨️ Global Enter pressed in dark screamer')
        e.preventDefault()
        e.stopPropagation()
        
        if (inputRef.current) {
          const value = inputRef.current.value.trim()
          if (value) {
            handleDarkScreamerSubmit(value)
          } else {
            console.log('⚠️ Empty input, but completing anyway')
            completeDarkScreamer()
          }
        } else {
          console.log('⚠️ Input not found, forcing completion')
          completeDarkScreamer()
        }
      }
    }

    if (isActive && screamerType === 'dark') {
      document.addEventListener('keydown', handleGlobalKeyPress, true)
    }

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress, true)
    }
  }, [isActive, screamerType])

  useEffect(() => {
    if (!isActive) return

    if (screamerType === 'dark') {
      createDarkScreamer()
    } else {
      createNormalScreamer()
    }

    return () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current)
      }
    }
  }, [isActive, screamerType])

  const createDarkThemeTransition = useCallback(() => {
    const container = document.createElement('div')
    container.className = 'dark-transition-overlay'
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #000000;
      z-index: 100000;
      pointer-events: none;
    `
    document.body.appendChild(container)
    transitionRef.current = container

    const vhsGrid = document.createElement('div')
    vhsGrid.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0;
    `
    container.appendChild(vhsGrid)

    const digitalRain = document.createElement('div')
    digitalRain.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(transparent 90%, rgba(255, 0, 0, 0.3) 100%);
      opacity: 0;
    `
    container.appendChild(digitalRain)

    const collapsePoint = document.createElement('div')
    collapsePoint.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0px;
      height: 0px;
      background: radial-gradient(circle, #ff0000, transparent);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
    `
    container.appendChild(collapsePoint)

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          if (container.parentNode) {
            container.parentNode.removeChild(container)
          }
          document.body.style.overflow = ''
          onComplete()
        }, 300)
      }
    })

    tl.to(container, {
      duration: 0.5,
      opacity: 1,
      ease: "power2.in"
    })
    .to(vhsGrid, {
      duration: 1,
      opacity: 0.3,
      ease: "power2.out"
    }, 0)
    .to(digitalRain, {
      duration: 2,
      opacity: 0.4,
      ease: "power2.inOut"
    }, 0)
    .to(collapsePoint, {
      duration: 0.5,
      opacity: 1,
      scale: 1,
      ease: "power2.out"
    }, 0)
    .to(collapsePoint, {
      duration: 1.5,
      width: '200vmax',
      height: '200vmax',
      opacity: 0,
      ease: "power2.inOut"
    }, 0.5)
    .to(container, {
      duration: 1,
      opacity: 0,
      ease: "power2.out"
    }, 1.5)

    return container
  }, [onComplete])

  const handleDarkScreamerSubmit = (inputValue) => {
    console.log('✅ Dark screamer submit:', inputValue)
    
    const container = containerRef.current
    if (!container) return

    const outputContainer = container.querySelector('.terminal-output')
    const inputContainer = container.querySelector('.terminal-input')
    const inputElement = container.querySelector('.hacker-input')

    if (outputContainer && inputElement) {
      const userResponse = document.createElement('div')
      userResponse.textContent = `> ${inputValue}`
      userResponse.style.cssText = `
        color: #ffff00;
        margin-top: 0.5rem;
        font-weight: bold;
      `
      outputContainer.appendChild(userResponse)

      if (inputElement) {
        inputElement.disabled = true
        inputElement.style.opacity = '0.5'
      }

      setTimeout(() => {
        const systemResponse = document.createElement('div')
        systemResponse.textContent = '> ACCESS DENIED. INITIATING SYSTEM RECOVERY...'
        systemResponse.style.cssText = `
          color: #ff0000;
          margin-top: 0.5rem;
          font-weight: bold;
          text-shadow: 0 0 10px #ff0000;
        `
        outputContainer.appendChild(systemResponse)

        setTimeout(() => {
          startDarkThemeTransition()
        }, 1000)
      }, 500)
    } else {
      startDarkThemeTransition()
    }
  }

  const startDarkThemeTransition = () => {
    console.log('🎬 Starting dark theme transition animation')
    
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current)
    }

    const container = containerRef.current
    if (!container) {
      document.body.style.overflow = ''
      onComplete()
      return
    }

    const terminal = container.querySelector('.hacker-terminal')
    
    const terminalTl = gsap.timeline({
      onComplete: () => {
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
        createDarkThemeTransition()
      }
    })

    if (terminal) {
      terminalTl.to(terminal, {
        duration: 0.8,
        scale: 0.8,
        rotation: -5,
        filter: 'blur(10px) hue-rotate(90deg)',
        ease: "power2.in"
      })
      .to(terminal, {
        duration: 0.5,
        scale: 0,
        rotation: 15,
        opacity: 0,
        ease: "power2.inOut"
      }, 0.3)
    } else {
      terminalTl.to(container, {
        duration: 0.8,
        opacity: 0,
        ease: "power2.out"
      })
    }
  }

  const completeDarkScreamer = () => {
    startDarkThemeTransition()
  }

  const createDarkScreamer = () => {
    const container = document.createElement('div')
    container.className = 'dark-terminal-screamer'
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #0a0a0a;
      font-family: 'Courier New', monospace;
      color: #00ff00;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    `

    document.body.appendChild(container)
    containerRef.current = container

    const terminal = document.createElement('div')
    terminal.className = 'hacker-terminal'
    terminal.style.cssText = `
      width: 80%;
      max-width: 800px;
      background: rgba(0, 20, 0, 0.9);
      border: 2px solid #00ff00;
      padding: 2rem;
      box-shadow: 0 0 50px rgba(0, 255, 0, 0.5);
      position: relative;
      overflow: hidden;
    `

    const terminalNoise = document.createElement('div')
    terminalNoise.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        repeating-linear-gradient(0deg, 
          rgba(0, 255, 0, 0.03) 0px, 
          rgba(0, 255, 0, 0.03) 1px, 
          transparent 1px, 
          transparent 2px
        );
      pointer-events: none;
      opacity: 0.3;
      animation: terminal-noise 0.1s infinite;
    `

    const outputContainer = document.createElement('div')
    outputContainer.className = 'terminal-output'
    outputContainer.style.cssText = `
      min-height: 200px;
      margin-bottom: 1rem;
      line-height: 1.4;
      font-size: 1.1rem;
    `

    const inputContainer = document.createElement('div')
    inputContainer.className = 'terminal-input'
    inputContainer.style.cssText = `
      display: flex;
      align-items: center;
      opacity: 0;
    `

    const prompt = document.createElement('span')
    prompt.textContent = '> '
    prompt.style.cssText = `
      color: #00ff00;
      margin-right: 0.5rem;
      font-weight: bold;
    `

    const inputElement = document.createElement('input')
    inputElement.type = 'text'
    inputElement.className = 'hacker-input'
    inputElement.style.cssText = `
      background: transparent;
      border: none;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 1.1rem;
      outline: none;
      width: 100%;
      caret-color: #00ff00;
      font-weight: bold;
    `
    inputElement.placeholder = 'TYPE ANYTHING AND PRESS ENTER...'
    inputRef.current = inputElement

    const cursor = document.createElement('span')
    cursor.className = 'input-cursor'
    cursor.textContent = '|'
    cursor.style.cssText = `
      color: #00ff00;
      animation: blink 1s infinite;
      margin-left: 2px;
      font-weight: bold;
    `

    inputContainer.appendChild(prompt)
    inputContainer.appendChild(inputElement)
    inputContainer.appendChild(cursor)

    terminal.appendChild(terminalNoise)
    terminal.appendChild(outputContainer)
    terminal.appendChild(inputContainer)
    container.appendChild(terminal)

    const tl = gsap.timeline()

    tl.fromTo(terminal, 
      { opacity: 0, scale: 0.8, y: 100 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }
    )

    document.body.style.overflow = 'hidden'

    let currentLineIndex = 0

    const typeNextLine = () => {
      if (currentLineIndex < darkTerminalLines.length) {
        const line = darkTerminalLines[currentLineIndex]
        typeText(line, outputContainer, () => {
          currentLineIndex++
          
          if (currentLineIndex === darkTerminalLines.length) {
            gsap.to(inputContainer, {
              opacity: 1,
              duration: 0.5,
              onComplete: () => {
                inputElement.focus()
                setIsDarkTerminalReady(true)
              }
            })
          } else {
            const newLine = document.createElement('div')
            outputContainer.appendChild(newLine)
            setTimeout(typeNextLine, 500)
          }
        })
      }
    }

    setTimeout(typeNextLine, 1000)

    const handleInput = (e) => {
      setUserInput(e.target.value)
    }

    inputElement.addEventListener('input', handleInput)

    return () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current)
      }
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
      document.body.style.overflow = ''
      inputElement.removeEventListener('input', handleInput)
      tl.kill()
    }
  }

  const typeText = (text, container, onComplete) => {
    const lineElement = document.createElement('div')
    lineElement.className = 'terminal-line'
    lineElement.style.cssText = `
      margin-bottom: 0.5rem;
    `
    container.appendChild(lineElement)

    let index = 0
    
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current)
    }

    typeIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        lineElement.textContent += text.charAt(index)
        index++
      } else {
        clearInterval(typeIntervalRef.current)
        if (onComplete) onComplete()
      }
    }, 50)
  }

  const createNormalScreamer = () => {
    const container = document.createElement('div')
    container.className = `screamer-container normal-screamer`
    container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: #000000 !important;
      z-index: 99999 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      overflow: hidden !important;
      pointer-events: none !important;
    `
    
    document.body.appendChild(container)
    containerRef.current = container

    const phrases = normalPhrases
    const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)]

    const textElement = document.createElement('div')
    textElement.textContent = selectedPhrase
    textElement.className = 'animated-text'

    const noiseElement = document.createElement('div')
    noiseElement.className = 'noise-layer'

    const vhsElement = document.createElement('div')
    vhsElement.className = 'vhs-overlay'

    container.appendChild(noiseElement)
    container.appendChild(vhsElement)
    container.appendChild(textElement)

    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          if (container.parentNode) {
            container.parentNode.removeChild(container)
          }
          document.body.style.overflow = ''
          onComplete()
        }, 1000)
      }
    })

    tl.fromTo([noiseElement, vhsElement], 
      { opacity: 0 },
      { 
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }
    )

    tl.fromTo(textElement, 
      { 
        opacity: 0,
        scale: 0.8
      },
      { 
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out"
      },
      "-=0.3"
    )

    const shakeTl = gsap.timeline({ repeat: 15 })
    shakeTl.to(textElement, {
      x: () => gsap.utils.random(-8, 8),
      y: () => gsap.utils.random(-4, 4),
      rotation: () => gsap.utils.random(-1, 1),
      duration: 0.05,
      ease: "power1.inOut"
    })

    tl.add(shakeTl, "-=1")

    tl.to([textElement, noiseElement, vhsElement], {
      filter: 'brightness(1.5) contrast(1.3)',
      duration: 2,
      ease: "power2.inOut"
    }, "-=1.5")

    tl.to([textElement, noiseElement, vhsElement], {
      opacity: 0,
      scale: 1.1,
      duration: 1,
      ease: "power2.in"
    })

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
      document.body.style.overflow = ''
      tl.kill()
    }
  }

  return null
}

export default ScreamerEffect