import { useState } from 'react'
import { useTimelineAuth } from '../hooks/useTimelineAuth.js'

const TABLES = [
  { number: 'Sweetheart', guests: ['Victoria Z', 'Alan Z'] },
  { number: 1,  guests: ['MiMi Scott', 'Ted Scott', 'Michelle Goins', 'Tim Goins', 'Carolyn Jenkins', 'Brian Jenkins', 'Alexander Biggs', 'Maria Biggs', 'Kathleen Kelley', 'Catherine Kelly'] },
  { number: 2,  guests: ['Katherine Herbout', 'Arthur Herbout', 'Henry Herbout', 'Valerie Wilson', 'Margaret Li', 'Ashley Reed', 'Ayushi Sinha', 'Alejandro Nuno', 'Tara Nuno', 'Catalina Ibarguen', 'Andrew Jordan'] },
  { number: 3,  guests: ['Doris Zhang', 'Michael Zhang', 'Adrian Zhang', 'Brett Zhang', 'Craig Zhang', 'Katie Zhang', 'Ray Zhang', 'Diana Zhang', 'Steven Zhang', 'Eric Zhang'] },
  { number: 4,  guests: ['Janet Gilmor', 'Rob III Gilmor', 'Chris Gilmor', 'Susan Gilmor', 'Lisa Meyer', 'Lisa Jamison', 'Todd Jamison', 'Clay Jamison', 'Rob Gilmor IV', 'Natalie Gilmor', 'Robbie Gilmor'] },
  { number: 5,  guests: ['Sylvie Errickson', 'Cal Jenkins', 'Jasmine Biggs', 'Sy Jenkins', 'Gabriel Rosa', 'Nabai Hatemariam', 'Jenn Mao', 'Kyle Devine', 'Rio Mizuno', 'Henry Chow'] },
  { number: 6,  guests: ['Xiaomin Wang', 'Xiaolin Wang', 'Xiaowei Wang', 'Karen Zhang', 'Charles Bowers', 'Dan Wang', 'Mrs Wang', 'Jamie Martin', 'Erin Frey', 'Carolyn Fu', 'Siffrien Diana', 'Ryan Geiser'] },
  { number: 7,  guests: ['KA Prophete', 'Paul Lee', 'Jasmine Qin', 'Sarah Park', 'Jason Han', 'Ariel Reyes', 'Fatemeh Bahari', 'David Dopfel', 'Julia Jones', 'Nelson Wu'] },
  { number: 8,  guests: ['Timothy Tabor', 'Akiko Tabor', 'Mrs. Sweeney', 'Mr. Sweeney', 'John Hefferon', 'Joy Cunningham', 'Adina Sterling', 'Elvin Sterling', 'Malia Mason', 'David Katch'] },
  { number: 9,  guests: ['Adam Hendrix', 'Zoe Tu', 'Madelyn Baron', 'Carl Lindquist', 'Jeffry Diament', 'John DiVittorio', 'G. Gray Cornelius', 'Lisa Shen', 'Zi-Xiang Shen', 'Kyle Smith'] },
  { number: 10, guests: ['Yi Gu', 'Thomas Safran', 'Patrico Almeida', 'Alexandra Strick', 'Andrew Gates', 'Jonathan Kaufman', 'Mohamed Hussein', 'Keila Farag', 'Hady Farag', 'Knar Abrahaymyan'] },
  { number: 11, guests: ['Tasha Brown', 'Austin Addison', 'Samantha Past', 'Kristy Yeung', 'Avery Tamakloe', 'Brandon McGhee', 'Richard Freeman', 'Jeremy Burton', 'Anyssa Chebbi', 'Zika Masmoudi'] },
  { number: 12, guests: ['Allison Sweeney', 'Kristen Kyreakakis', 'Erich Schimpf', 'Chloe Ryan', 'Kevin Wachter', 'Campbell Shea', 'Barett Shea', 'Hilary Shea', 'Stewart Hoffmann'] },
]

export function SeatingPage() {
  const { unlocked, unlock, error: pinError, clearError } = useTimelineAuth()
  const [pinDraft, setPinDraft] = useState('')
  const [search, setSearch]     = useState('')
  const [view, setView]         = useState('tables')

  function handlePinSubmit(e) {
    e.preventDefault()
    unlock(pinDraft)
  }

  if (!unlocked) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
        <svg className="w-8 h-8 text-stone-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="text-sm text-stone-400 dark:text-stone-500">Enter your PIN to view the seating chart</p>
        <form onSubmit={handlePinSubmit} className="flex items-center gap-2">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pinDraft}
            onChange={e => { setPinDraft(e.target.value); clearError() }}
            placeholder="PIN"
            autoFocus
            className="w-32 text-sm text-center border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-taupe-600"
          />
          <button type="submit" className="text-sm bg-taupe-600 text-white px-4 py-1.5 rounded-lg hover:bg-taupe-700 transition-colors">
            Unlock
          </button>
        </form>
        {pinError && <p className="text-xs text-red-400">Incorrect PIN</p>}
      </div>
    )
  }

  const q = search.trim().toLowerCase()
  const allGuests = TABLES.flatMap(t => t.guests.map(g => ({ guest: g, table: t.number })))
  const matchedGuest = q ? allGuests.find(({ guest }) => guest.toLowerCase().includes(q)) : null
  const lastName = name => name.split(' ').slice(-1)[0]
  const sortedGuests = [...allGuests].sort((a, b) => lastName(a.guest).localeCompare(lastName(b.guest)))

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100">Seating Chart</h2>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-stone-200 dark:border-stone-600 text-xs font-medium">
            <button
              onClick={() => setView('tables')}
              className={`px-3 py-1.5 transition-colors ${view === 'tables' ? 'bg-taupe-600 text-white' : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'}`}
            >
              By Table
            </button>
            <button
              onClick={() => setView('alpha')}
              className={`px-3 py-1.5 transition-colors ${view === 'alpha' ? 'bg-taupe-600 text-white' : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'}`}
            >
              A–Z
            </button>
          </div>
          <span className="text-xs text-stone-400 dark:text-stone-500">
            {TABLES.reduce((n, t) => n + t.guests.length, 0)} guests
          </span>
        </div>
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
            ? <><span className="font-medium text-stone-700 dark:text-stone-200">{matchedGuest.guest}</span> <span className="text-stone-400 dark:text-stone-500">is at</span> <span className="font-semibold text-taupe-700 dark:text-taupe-400">{matchedGuest.table === 'Sweetheart' ? 'Sweetheart Table' : `Table ${matchedGuest.table}`}</span></>
            : <span className="text-stone-400 dark:text-stone-500">No guest found matching "{search}"</span>
          }
        </div>
      )}

      {view === 'tables' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TABLES.map(table => {
            const highlight = q && table.guests.some(g => g.toLowerCase().includes(q))
            return (
              <div
                key={table.number}
                className={`bg-white dark:bg-stone-800 rounded-xl shadow-sm p-4 transition-all ${highlight ? 'ring-2 ring-taupe-600' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-lg text-stone-700 dark:text-stone-200">
                    {table.number === 'Sweetheart' ? 'Sweetheart Table' : `Table ${table.number}`}
                  </span>
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
      ) : (
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm divide-y divide-stone-100 dark:divide-stone-700">
          {sortedGuests
            .filter(({ guest }) => !q || guest.toLowerCase().includes(q))
            .map(({ guest, table }) => (
              <div key={guest} className={`flex items-center justify-between px-4 py-2.5 ${q && guest.toLowerCase().includes(q) ? 'bg-taupe-50 dark:bg-stone-700/50' : ''}`}>
                <span className={`text-sm ${q && guest.toLowerCase().includes(q) ? 'font-semibold text-taupe-700 dark:text-taupe-400' : 'text-stone-700 dark:text-stone-200'}`}>
                  {guest}
                </span>
                <span className="text-xs text-stone-400 dark:text-stone-500 ml-4 flex-shrink-0">
                  {table === 'Sweetheart' ? 'Sweetheart' : `Table ${table}`}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
