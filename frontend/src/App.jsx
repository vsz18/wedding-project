import { useState } from 'react'
import { useDarkMode } from './hooks/useDarkMode.js'
import { Nav } from './components/Nav.jsx'
import { CountdownHeader } from './components/CountdownHeader.jsx'
import { TimelinePage } from './pages/TimelinePage.jsx'
import { VendorsPage } from './pages/VendorsPage.jsx'
import { BridesmaidsPage } from './pages/BridesmaidsPage.jsx'
import { SeatingPage } from './pages/SeatingPage.jsx'

const PROTECTED = new Set(['vendors', 'seating', 'timeline', 'bridesmaids'])

function PasswordGate({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const correct = import.meta.env.VITE_TIMELINE_PIN || '1234'
    if (pin === correct) {
      onUnlock()
    } else {
      setError(true)
      setPin('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
      <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100">Protected</h2>
      <p className="text-sm text-stone-400 dark:text-stone-500">Enter the password to continue.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="password"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(false) }}
          placeholder="Password"
          autoFocus
          className="text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-taupe-600"
        />
        <button type="submit" className="text-sm bg-taupe-600 text-white px-4 py-2 rounded-lg hover:bg-taupe-700 transition-colors">
          Enter
        </button>
      </form>
      {error && <p className="text-xs text-red-400">Incorrect password.</p>}
    </div>
  )
}

export function App() {
  const [tab, setTab] = useState('timeline')
  const { dark, toggle: toggleDark } = useDarkMode()
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('tabs-unlocked') === 'true'
  )

  function handleUnlock() {
    sessionStorage.setItem('tabs-unlocked', 'true')
    setUnlocked(true)
  }

  const showGate = PROTECTED.has(tab) && !unlocked

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 font-sans transition-colors">
      <CountdownHeader />
      <Nav active={tab} onChange={setTab} dark={dark} onToggleDark={toggleDark} />
      {showGate && <PasswordGate onUnlock={handleUnlock} />}
      {!showGate && tab === 'timeline'    && <TimelinePage />}
      {!showGate && tab === 'bridesmaids' && <BridesmaidsPage />}
      {!showGate && tab === 'vendors'     && <VendorsPage readOnly />}
      {!showGate && tab === 'seating'     && <SeatingPage />}
    </div>
  )
}
