import { useState, useEffect } from 'react'
import Agreement from './components/Agreement'
import Main from './components/Main'
import CookieConsent from './components/CookieConsent'
import CursorManager from './components/CursorManager'
import { useCookies } from './hooks/useCookies'
import './App.css'

function App() {
  const [agreed, setAgreed] = useState(false)
  const [showCookieConsent, setShowCookieConsent] = useState(false)
  const { cookiesEnabled, enableCookies, disableCookies, getCookie } = useCookies()

  useEffect(() => {
    const cookieDecision = localStorage.getItem('cookies-decision')
    if (!cookieDecision) {
      setShowCookieConsent(true)
    }
  }, [])

  const handleAgree = () => {
    setAgreed(true)
  }

  const handleCookieAccept = () => {
    enableCookies()
    setShowCookieConsent(false)
    localStorage.setItem('cookies-decision', 'accepted')
  }

  const handleCookieReject = () => {
    disableCookies()
    setShowCookieConsent(false)
    localStorage.setItem('cookies-decision', 'rejected')
  }

  return (
    <div className="app">
      <CursorManager />
      
      {showCookieConsent ? (
        <CookieConsent 
          onAccept={handleCookieAccept} 
          onReject={handleCookieReject} 
        />
      ) : !agreed ? (
        <Agreement onAgree={handleAgree} />
      ) : (
        <Main />
      )}
    </div>
  )
}

export default App