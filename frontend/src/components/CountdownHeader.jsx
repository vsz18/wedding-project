import { useState } from 'react'
import { WeatherWidget } from './WeatherWidget.jsx'

/** @param {{ daysRemaining: number, weddingDate: string, onDateChange: (s:string)=>void, dayOfMode: boolean }} props */
export function CountdownHeader({ daysRemaining, weddingDate, onDateChange, dayOfMode }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(weddingDate)

  const formatted = new Date(weddingDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })

  function handleSave() {
    onDateChange(draft)
    setEditing(false)
  }

  return (
    <div className={`text-center py-8 sm:py-10 px-4 transition-colors ${dayOfMode ? 'bg-taupe-50 dark:bg-stone-800' : ''}`}>
      {dayOfMode && (
        <div className="text-xs font-semibold uppercase tracking-widest text-taupe-600 mb-3">
          Day Of
        </div>
      )}
      <div className="font-serif text-6xl sm:text-8xl font-medium text-stone-800 dark:text-stone-100 leading-none tabular-nums">
        {daysRemaining}
      </div>
      <div className="mt-2 text-stone-500 dark:text-stone-400 text-sm uppercase tracking-widest font-medium">
        {daysRemaining === 1 ? 'day' : 'days'} until the Scott-Zhang wedding
      </div>

      <div className="mt-4">
        {editing ? (
          <div className="flex items-center justify-center gap-2">
            <input
              type="date"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              className="border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 rounded-md px-3 py-1.5 text-sm text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-taupe-600"
            />
            <button onClick={handleSave} className="px-3 py-1.5 bg-taupe-600 text-white text-sm rounded-md hover:bg-taupe-700 transition-colors">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-stone-500 dark:text-stone-400 text-sm hover:text-stone-700 dark:hover:text-stone-200 transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => { setDraft(weddingDate); setEditing(true) }} className="text-taupe-600 text-sm hover:underline">
            {formatted}
          </button>
        )}
      </div>

      <WeatherWidget />
    </div>
  )
}
