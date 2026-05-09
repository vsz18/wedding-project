import { useState } from 'react'
import { useDarkMode } from '../hooks/useDarkMode.js'
import { TimelinePage } from './TimelinePage.jsx'
import { VendorsPage } from './VendorsPage.jsx'
import { BridesmaidsPage } from './BridesmaidsPage.jsx'
import { PackingPage } from './PackingPage.jsx'

const ROLE_META = {
  bride:        { label: 'Bride' },
  bridesmaid:   { label: 'Bridesmaids' },
  groom:        { label: 'Groom' },
  family:       { label: 'Family' },
  guest:        { label: 'Guests' },
  dj:           { label: 'DJ' },
  photographer: { label: 'Photographer' },
  venue:        { label: 'Venue' },
  mac:          { label: 'The Aunts' },
  scott:        { label: 'Scott' },
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
    </svg>
  )
}

export function VendorView({ personFilter = null }) {
  const [tab, setTab] = useState('timeline')
  const { dark, toggle: toggleDark } = useDarkMode()

  const role = personFilter && ROLE_META[personFilter] ? ROLE_META[personFilter] : null

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 font-sans transition-colors">
      <div className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-0 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-stone-800 dark:text-stone-100">Scott-Zhang Wedding</h1>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              {role ? `${role.label} · May 30, 2026` : 'May 30, 2026'}
            </p>
          </div>
          <button
            onClick={toggleDark}
            title={dark ? 'Light mode' : 'Dark mode'}
            className="p-2 rounded-lg text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <div className="max-w-2xl mx-auto px-4 flex gap-0.5">
          {[
            { id: 'timeline',     label: 'Timeline' },
            ...(personFilter === 'bridesmaid' ? [{ id: 'bridesmaids', label: 'Bridesmaids' }, { id: 'packing', label: 'Packing' }] : []),
            { id: 'vendors',      label: 'Team' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === t.id
                  ? 'border-taupe-600 text-taupe-600'
                  : 'border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'timeline'    && <TimelinePage personFilter={personFilter} />}
      {tab === 'bridesmaids' && <BridesmaidsPage />}
      {tab === 'packing'     && <PackingPage />}
      {tab === 'vendors'     && <VendorsPage readOnly />}
    </div>
  )
}
