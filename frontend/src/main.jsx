import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { VendorView } from './pages/VendorView.jsx'

const path = window.location.pathname
const URL_ALIASES = { aunts: 'mac' }
const rawFilter = path.startsWith('/team/') ? (path.slice('/team/'.length) || null) : null
const personFilter = rawFilter ? (URL_ALIASES[rawFilter] ?? rawFilter) : null

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {path.startsWith('/team') ? <VendorView personFilter={personFilter} /> : <App />}
  </StrictMode>,
)
