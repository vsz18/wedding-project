import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { VendorView } from './pages/VendorView.jsx'

const isVendorView = window.location.pathname.startsWith('/vendor')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isVendorView ? <VendorView /> : <App />}
  </StrictMode>,
)
