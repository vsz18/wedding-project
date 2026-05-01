import { useState } from 'react'
import { useDarkMode } from '../hooks/useDarkMode.js'

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

const TABLES = [
  { number: 1,  guests: ['Victoria Z', 'Alan Z'] },
  { number: 2,  guests: ['MiMi Scott', 'Ted Scott', 'Michelle Goins', 'Tim Goins', 'Carolyn Jenkins', 'Brian Jenkins', 'Alexander Biggs', 'Maria Biggs', 'Kathleen Kelley', 'Catherine Kelly'] },
  { number: 3,  guests: ['Katherine Herbout', 'Arthur Herbout', 'Henry Herbout', 'Valerie Wilson', 'Margaret Li', 'Ashley Reed', 'Ayushi Sinha', 'Alejandro Nuno', 'Tara Nuno', 'Catalina Ibarguen', 'Andrew Jordan'] },
  { number: 4,  guests: ['Doris Zhang', 'Michael Zhang', 'Adrian Zhang', 'Brett Zhang', 'Craig Zhang', 'Katie Zhang', 'Ray Zhang', 'Diana Zhang', 'Steven Zhang', 'Eric Zhang'] },
  { number: 5,  guests: ['Janet Gilmor', 'Rob III Gilmor', 'Chris Gilmor', 'Susan Gilmor', 'Lisa Meyer', 'Nanci Charzuk', 'Michael Charzuk', 'Lisa Jamison', 'Todd Jamison', 'Clay Jamison'] },
  { number: 6,  guests: ['Sylvie Errickson', 'Cal Jenkins', 'Jasmine Biggs', 'Sy Jenkins', 'Gabriel Rosa', 'Nabai Hatemariam', 'Jenn Mao', 'Kyle Devine', 'Rio Mizuno', 'Julia Jones', 'Nelson Wu', 'Henry Chow'] },
  { number: 7,  guests: ['Xiaomin Wang', 'Xiaolin Wang', 'Xiaowei Wang', 'Karen Zhang', 'Charles Bowers', 'Knar Abrahaymyan', 'Gaia Marchisio', 'Riccardo Brusco', 'Dan Wang', 'Mrs Wang'] },
  { number: 8,  guests: ['KA Prophete', 'Paul Lee', 'Jasmine Qin', 'Sarah Park', 'Jason Han', 'Ariel Reyes', 'Fatemeh Bahari', 'David Dopfel', 'Rob Gilmor IV', 'Natalie Gilmor', 'Robbie Gilmor'] },
  { number: 9,  guests: ['Timothy Tabor', 'Akiko Tabor', 'Mrs. Sweeney', 'Mr. Sweeney', 'John Hefferon', 'Joy Cunningham', 'Adina Sterling', 'Elvin Sterling', 'Malia Mason', 'David Katch'] },
  { number: 10, guests: ['Adam Hendrix', 'Zoe Tu', 'Madelyn Baron', 'Carl Lindquist', 'Jeffry Diament', 'John DiVittorio', 'G. Gray Cornelius', 'Lisa Shen', 'Zi-Xiang Shen', 'Kyle Smith'] },
  { number: 11, guests: ['Yi Gu', 'Thomas Safran', 'Patrico Almeida', 'Alexandra Strick', 'Andrew Gates', 'Jonathan Kaufman', 'Mohamed Hussein', 'Siffrien Diana', 'Ryan Geiser', 'Keila Farag', 'Hady Farag', 'Carolyn Fu'] },
  { number: 12, guests: ['Tasha Brown', 'Austin Addison', 'Samantha Past', 'Kristy Yeung', 'Avery Tamakloe', 'Brandon McGhee', 'Richard Freeman', 'Jeremy Burton', 'Anyssa Chebbi', 'Zika Masmoudi'] },
  { number: 13, guests: ['Allison Sweeney', 'Kristen Kyreakakis', 'Erich Schimpf', 'Chloe Ryan', 'Kevin Wachter', 'Campbell Shea', 'Barett Shea', 'Hilary Shea', 'Stewart Hoffmann'] },
]

const STORAGE_KEY = 'hbic-checklist'
const DEFAULT_ITEMS = [
  { id: 'escort-cards',   label: 'Escort cards',   checked: false },
  { id: 'table-numbers',  label: 'Table numbers',  checked: false },
  { id: 'favors',         label: 'Favors',          checked: false },
]

function loadChecklist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return DEFAULT_ITEMS
}

function Checklist() {
  const [items, setItems] = useState(loadChecklist)
  const [draft, setDraft] = useState('')

  function update(next) {
    setItems(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function toggle(id) {
    update(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  function addItem(e) {
    e.preventDefault()
    const label = draft.trim()
    if (!label) return
    update([...items, { id: Date.now().toString(), label, checked: false }])
    setDraft('')
  }

  function removeItem(id) {
    update(items.filter(i => i.id !== id))
  }

  const done = items.filter(i => i.checked).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100">Reception Checklist</h2>
        <span className="text-xs text-stone-400 dark:text-stone-500">{done}/{items.length} packed</span>
      </div>

      <div className="space-y-1.5 mb-3">
        {items.map(item => (
          <div key={item.id} className="group flex items-center gap-3 bg-white dark:bg-stone-800 rounded-xl px-4 py-3 shadow-sm">
            <button
              onClick={() => toggle(item.id)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                item.checked ? 'bg-taupe-600 border-taupe-600' : 'border-stone-300 dark:border-stone-600 hover:border-taupe-600'
              }`}
            >
              {item.checked && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm ${item.checked ? 'line-through text-stone-400 dark:text-stone-600' : 'text-stone-700 dark:text-stone-200'}`}>
              {item.label}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 dark:text-stone-600 hover:text-red-400"
              aria-label="Remove item"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8 8M11 3l-8 8" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={addItem} className="flex gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Add an item…"
          className="flex-1 text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-taupe-600 placeholder:text-stone-400 dark:placeholder:text-stone-500"
        />
        <button type="submit" className="text-sm bg-taupe-600 text-white px-4 py-2 rounded-lg hover:bg-taupe-700 transition-colors">
          Add
        </button>
      </form>
    </div>
  )
}

function SeatingChart() {
  const [search, setSearch] = useState('')
  const q = search.trim().toLowerCase()

  const matchedGuest = q
    ? TABLES.flatMap(t => t.guests.map(g => ({ guest: g, table: t.number }))).find(({ guest }) => guest.toLowerCase().includes(q))
    : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100">Seating Chart</h2>
        <span className="text-xs text-stone-400 dark:text-stone-500">
          {TABLES.reduce((n, t) => n + t.guests.length, 0)} guests · {TABLES.length} tables
        </span>
      </div>

      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
          <circle cx="6" cy="6" r="4"/><path strokeLinecap="round" d="M10 10l2.5 2.5"/>
        </svg>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Find a guest…"
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 dark:text-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-taupe-600 placeholder:text-stone-400 dark:placeholder:text-stone-500"
        />
      </div>

      {q && (
        <div className="mb-4 p-3 rounded-xl bg-taupe-50 dark:bg-stone-800 border border-taupe-200 dark:border-stone-700 text-sm">
          {matchedGuest
            ? <><span className="font-medium text-stone-700 dark:text-stone-200">{matchedGuest.guest}</span> <span className="text-stone-400 dark:text-stone-500">is at</span> <span className="font-semibold text-taupe-700 dark:text-taupe-400">Table {matchedGuest.table}</span></>
            : <span className="text-stone-400 dark:text-stone-500">No guest found matching "{search}"</span>
          }
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TABLES.map(table => {
          const highlight = q && table.guests.some(g => g.toLowerCase().includes(q))
          return (
            <div
              key={table.number}
              className={`bg-white dark:bg-stone-800 rounded-xl shadow-sm p-4 transition-all ${
                highlight ? 'ring-2 ring-taupe-600' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-lg text-stone-700 dark:text-stone-200">Table {table.number}</span>
                <span className="text-xs text-stone-400 dark:text-stone-500">{table.guests.length}</span>
              </div>
              <ul className="space-y-0.5">
                {table.guests.map(guest => (
                  <li key={guest} className={`text-xs ${
                    q && guest.toLowerCase().includes(q)
                      ? 'font-semibold text-taupe-700 dark:text-taupe-400'
                      : 'text-stone-500 dark:text-stone-400'
                  }`}>
                    {guest}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function HbicPage() {
  const [tab, setTab] = useState('checklist')
  const { dark, toggle: toggleDark } = useDarkMode()

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 font-sans transition-colors">
      <div className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-0 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-stone-800 dark:text-stone-100">Scott-Zhang Wedding</h1>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">May 30, 2026</p>
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
          {[{ id: 'checklist', label: 'Checklist' }, { id: 'seating', label: 'Seating Chart' }].map(t => (
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

      {tab === 'checklist' && <Checklist />}
      {tab === 'seating'   && <SeatingChart />}
    </div>
  )
}
