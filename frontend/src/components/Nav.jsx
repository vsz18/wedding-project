const ALL_TABS = [
  { id: 'tasks',        label: 'Tasks' },
  { id: 'timeline',     label: 'Timeline' },
  { id: 'packing',      label: 'Packing' },
  { id: 'bridesmaids',  label: 'Bridesmaids' },
  { id: 'vendors',      label: 'Team' },
]

const DAY_OF_TABS = new Set(['timeline', 'vendors'])

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

/**
 * @param {{ active: string, onChange: (id:string)=>void, dark: boolean, onToggleDark: ()=>void, dayOfMode: boolean, onToggleDayOf: ()=>void }} props
 */
export function Nav({ active, onChange, dark, onToggleDark, dayOfMode, onToggleDayOf }) {
  const tabs = dayOfMode ? ALL_TABS.filter(t => DAY_OF_TABS.has(t.id)) : ALL_TABS

  return (
    <nav className="sticky top-0 z-10 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
      <div className="max-w-2xl mx-auto px-2 sm:px-4 flex items-center gap-1">
        {/* Tab buttons — scrollable on small screens */}
        <div className="flex gap-0.5 overflow-x-auto flex-1 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`px-3 sm:px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${
                active === tab.id
                  ? 'border-taupe-600 text-taupe-600'
                  : 'border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-0.5 flex-shrink-0 pl-1">
          {/* Day-of mode toggle */}
          <button
            onClick={onToggleDayOf}
            title={dayOfMode ? 'Exit day-of mode' : 'Day-of mode'}
            className={`px-2 py-2 rounded-lg text-xs font-semibold transition-colors ${
              dayOfMode
                ? 'bg-taupe-600 text-white'
                : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
            }`}
          >
            {dayOfMode ? '✦ Day Of' : '✦'}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  )
}
