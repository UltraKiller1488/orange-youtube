import { useState } from 'react'
import Agreement from './components/Agreement.jsx'
import Main from './components/Main.jsx'
import './App.css'

function App() {
  const [agreed, setAgreed] = useState(false)

  const handleAgree = () => {
    setAgreed(true)
  }

  return (
    <div className="app">
      {!agreed ? (
        <Agreement onAgree={handleAgree} />
      ) : (
        <Main />
      )}
    </div>
  )
}

export default App