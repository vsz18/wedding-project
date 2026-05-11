import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { VendorView } from './pages/VendorView.jsx'

const path = window.location.pathname
const URL_ALIASES = { aunts: 'mac' }
const VALID_FILTERS = new Set(['bride','bridesmaid','groom','groomsman','guest','dj','photographer','venue','mac','scott','gilmor'])
const rawFilter = path.startsWith('/team/') ? (path.slice('/team/'.length) || null) : null
const personFilter = rawFilter ? (URL_ALIASES[rawFilter] ?? rawFilter) : null
const isValidTeamRoute = path.startsWith('/team') && (!personFilter || VALID_FILTERS.has(personFilter))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isValidTeamRoute ? <VendorView personFilter={personFilter} /> : <App />}
  </StrictMode>,
)
