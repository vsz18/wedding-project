import { useState } from 'react'
import { useDarkMode } from './hooks/useDarkMode.js'
import { Nav } from './components/Nav.jsx'
import { CountdownHeader } from './components/CountdownHeader.jsx'
import { TimelinePage } from './pages/TimelinePage.jsx'
import { VendorsPage } from './pages/VendorsPage.jsx'
import { BridesmaidsPage } from './pages/BridesmaidsPage.jsx'
import { SeatingPage } from './pages/SeatingPage.jsx'

export function App() {
  const [tab, setTab] = useState('timeline')
  const { dark, toggle: toggleDark } = useDarkMode()

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 font-sans transition-colors">
      <CountdownHeader />
      <Nav active={tab} onChange={setTab} dark={dark} onToggleDark={toggleDark} />
      {tab === 'timeline'    && <TimelinePage />}
      {tab === 'bridesmaids' && <BridesmaidsPage />}
      {tab === 'vendors'     && <VendorsPage readOnly />}
      {tab === 'seating'     && <SeatingPage />}
    </div>
  )
}
