import { useState } from 'react'

/** @param {{ daysRemaining: number, weddingDate: string, onDateChange: (s:string)=>void }} props */
export function CountdownHeader({ daysRemaining, weddingDate, onDateChange }) {
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
    <div className="text-center py-10 px-4">
      <div className="font-serif text-8xl font-medium text-stone-800 leading-none tabular-nums">
        {daysRemaining}
      </div>
      <div className="mt-2 text-stone-500 text-sm uppercase tracking-widest font-medium">
        {daysRemaining === 1 ? 'day' : 'days'} until your wedding
      </div>

      <div className="mt-4">
        {editing ? (
          <div className="flex items-center justify-center gap-2">
            <input
              type="date"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              className="border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-taupe-600"
            />
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-taupe-600 text-white text-sm rounded-md hover:bg-taupe-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 text-stone-500 text-sm hover:text-stone-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setDraft(weddingDate); setEditing(true) }}
            className="text-taupe-600 text-sm hover:underline"
          >
            {formatted}
          </button>
        )}
      </div>
    </div>
  )
}
