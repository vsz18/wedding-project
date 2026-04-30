import { useState } from 'react'

const CATEGORIES = [
  'general', 'venue', 'catering', 'logistics',
  'entertainment', 'attire', 'finance', 'personal', 'events',
]

/** @param {{ onAdd: (task: object) => Promise<void> }} props */
export function AddTaskForm({ onAdd }) {
  const [open, setOpen]       = useState(false)
  const [title, setTitle]     = useState('')
  const [category, setCategory] = useState('general')
  const [dueDay, setDueDay]   = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onAdd({ title: title.trim(), category, due_day: dueDay ? Number(dueDay) : null })
      setTitle('')
      setCategory('general')
      setDueDay('')
      setOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <div className="max-w-2xl mx-auto w-full px-4 pb-8">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-2 px-4 py-3 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-lg text-stone-400 dark:text-stone-500 hover:border-taupe-600 hover:text-taupe-600 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v10M3 8h10" />
          </svg>
          Add a task
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 pb-8">
      <form onSubmit={handleSubmit} className="border border-stone-200 dark:border-stone-700 rounded-xl p-4 shadow-sm bg-white dark:bg-stone-800">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          className="w-full text-sm text-stone-700 dark:text-stone-200 placeholder-stone-300 dark:placeholder-stone-500 border-none outline-none mb-3 font-medium bg-transparent"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="text-xs text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-700 border-none rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-taupe-600"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          <input
            type="number" min={1} max={30}
            placeholder="Due day (1–30)"
            value={dueDay}
            onChange={e => setDueDay(e.target.value)}
            className="text-xs text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-700 rounded-md px-2 py-1.5 w-32 focus:outline-none focus:ring-2 focus:ring-taupe-600 border-none"
          />

          <div className="ml-auto flex gap-2">
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 px-3 py-1.5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving || !title.trim()} className="text-xs bg-taupe-600 text-white px-3 py-1.5 rounded-md hover:bg-taupe-700 disabled:opacity-40 transition-colors">
              {saving ? 'Adding…' : 'Add task'}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  )
}
