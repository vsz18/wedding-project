import { useState } from 'react'
import { useTimeline } from '../hooks/useTimeline.js'
import { useDeleteUndo } from '../hooks/useDeleteUndo.js'
import { UndoToast } from '../components/UndoToast.jsx'

const CATEGORY_COLORS = {
  getting_ready:  'bg-pink-50 text-pink-700',
  ceremony:       'bg-purple-50 text-purple-700',
  reception:      'bg-blue-50 text-blue-700',
  photos:         'bg-amber-50 text-amber-700',
  travel:         'bg-teal-50 text-teal-700',
  vendor_arrival: 'bg-stone-100 text-stone-600',
  general:        'bg-stone-100 text-stone-600',
}

const STATUS_STYLES = {
  'on-time':  { dot: 'bg-green-400',   card: '',                              badge: null },
  'buffered': { dot: 'bg-yellow-400',  card: 'border-l-4 border-yellow-300', badge: () => 'bg-yellow-100 text-yellow-700', label: d => `Buffer absorbing +${d}m` },
  'delayed':  { dot: 'bg-orange-500',  card: 'border-l-4 border-orange-400', badge: () => 'bg-orange-100 text-orange-700', label: d => `Ripple: +${d}m late` },
}

const FILTERS = [
  { id: 'all',            label: 'All' },
  { id: 'getting_ready',  label: 'Getting Ready' },
  { id: 'ceremony',       label: 'Ceremony' },
  { id: 'reception',      label: 'Reception' },
  { id: 'photos',         label: 'Photos' },
  { id: 'travel',         label: 'Travel' },
  { id: 'vendor_arrival', label: 'Vendor Arrivals' },
]

const CATEGORY_OPTIONS = ['getting_ready','ceremony','reception','photos','travel','vendor_arrival','general']

const INPUT = 'text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-taupe-600'

function fmtDuration(mins) {
  if (!mins) return null
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function DurationInput({ value, onChange, label = 'How long will it last?' }) {
  const hours = Math.floor((value || 0) / 60)
  const mins  = (value || 0) % 60
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-stone-400 dark:text-stone-500">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="number" min={0} value={hours}
          onChange={e => onChange(Math.max(0, Number(e.target.value)) * 60 + mins)}
          className="w-16 text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-taupe-600"
          aria-label="Hours"
        />
        <span className="text-xs text-stone-400 dark:text-stone-500">hr</span>
        <input
          type="number" min={0} max={59} value={mins}
          onChange={e => onChange(hours * 60 + Math.min(59, Math.max(0, Number(e.target.value))))}
          className="w-16 text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-taupe-600"
          aria-label="Minutes"
        />
        <span className="text-xs text-stone-400 dark:text-stone-500">min</span>
      </div>
    </div>
  )
}

function EventEditForm({ event, onSave, onCancel }) {
  const [form, setForm] = useState({
    title:         event.title,
    start_time:    event.start_time?.slice(0, 5) ?? '',
    duration_mins: event.duration_mins,
    buffer_mins:   event.buffer_mins,
    location:      event.location ?? '',
    category:      event.category ?? 'general',
    notes:         event.notes ?? '',
    delay_mins:    event.delay_mins ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSave() {
    setSaving(true)
    try { await onSave(event.id, form) } finally { setSaving(false) }
  }

  return (
    <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-700 mt-3">
      <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Event title" className={`w-full ${INPUT}`} />
      <div className="flex gap-2 flex-wrap">
        <div className="flex flex-col gap-0.5">
          <label className="text-xs text-stone-400 dark:text-stone-500">Start time</label>
          <input type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} className={INPUT} />
        </div>
        <DurationInput label="How long will it last?" value={form.duration_mins} onChange={v => set('duration_mins', v)} />
        <div className="flex flex-col gap-0.5">
          <label className="text-xs text-stone-400 dark:text-stone-500">Buffer (min)</label>
          <input type="number" min={0} value={form.buffer_mins} onChange={e => set('buffer_mins', Number(e.target.value))} className={`w-24 ${INPUT}`} />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Location" className={`flex-1 ${INPUT}`} />
        <select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
        </select>
      </div>
      <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Details (optional)" rows={2} className={`w-full ${INPUT} resize-none`} />
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="text-sm text-stone-400 dark:text-stone-500 px-3 py-1.5 hover:text-stone-600 dark:hover:text-stone-300">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="text-sm bg-taupe-600 text-white px-4 py-1.5 rounded-lg hover:bg-taupe-700 disabled:opacity-40 transition-colors">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function EventCard({ event, onSetDelay, onUpdate, onDelete }) {
  const [editing, setEditing]     = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [delayInput, setDelayInput] = useState(String(event.delay_mins || 0))

  const st = STATUS_STYLES[event.status] || STATUS_STYLES['on-time']
  const isDelayed = event.status !== 'on-time'

  function handleDelayBlur() {
    const val = Math.max(0, parseInt(delayInput, 10) || 0)
    setDelayInput(String(val))
    if (val !== (event.delay_mins || 0)) onSetDelay(event.id, val)
  }

  async function handleSave(id, data) {
    await onUpdate(id, data)
    setEditing(false)
  }

  return (
    <div className={`group relative bg-white dark:bg-stone-800 rounded-xl shadow-sm p-4 ${st.card}`}>
      <div className="flex items-start gap-3">
        {/* Time column */}
        <div className="flex-shrink-0 w-16 sm:w-20 text-right">
          <span className={`text-sm font-medium ${isDelayed ? 'line-through text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'}`}>
            {event.scheduledDisplay}
          </span>
          {isDelayed && (
            <div className="text-xs font-semibold text-orange-500">{event.effectiveStartDisplay}</div>
          )}
        </div>

        <div className="flex-shrink-0 mt-1.5">
          <span className={`block w-2.5 h-2.5 rounded-full ${st.dot}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{event.title}</p>
              {event.location && <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{event.location}</p>}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {event.category && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.general}`}>
                  {event.category.replace('_', ' ')}
                </span>
              )}
              <button
                onClick={() => setEditing(p => !p)}
                aria-label="Edit event"
                className={`transition-all ${editing ? 'text-taupe-600' : 'opacity-0 group-hover:opacity-100 text-stone-300 dark:text-stone-600 hover:text-taupe-600'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 1.5l3 3-7 7H2.5v-3l7-7z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(event.id)}
                aria-label="Delete event"
                className="opacity-0 group-hover:opacity-100 text-stone-300 dark:text-stone-600 hover:text-red-400 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8 8M11 3l-8 8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {event.duration_mins > 0 && <span className="text-xs text-stone-400 dark:text-stone-500">{fmtDuration(event.duration_mins)}</span>}
            {event.buffer_mins > 0   && <span className="text-xs text-stone-300 dark:text-stone-600">+{fmtDuration(event.buffer_mins)} buffer</span>}
            {event.status !== 'on-time' && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${st.badge(event.incomingDelay)}`}>
                {st.label(event.incomingDelay)}
              </span>
            )}
            {event.notes && (
              <button
                onClick={() => setShowNotes(p => !p)}
                className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
              >
                Details
                <svg className={`w-3 h-3 transition-transform ${showNotes ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 4l4 4 4-4" />
                </svg>
              </button>
            )}
          </div>

          {/* Notes dropdown */}
          {event.notes && showNotes && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed bg-stone-50 dark:bg-stone-700/50 rounded-lg px-3 py-2 whitespace-pre-wrap">
              {event.notes}
            </p>
          )}

          {/* Delay row */}
          <div className="flex items-center gap-2 mt-2">
            <label className="text-xs text-stone-400 dark:text-stone-500">Running late:</label>
            <input
              type="number" min={0} max={120}
              value={delayInput}
              onChange={e => setDelayInput(e.target.value)}
              onBlur={handleDelayBlur}
              onKeyDown={e => e.key === 'Enter' && e.target.blur()}
              className="w-14 text-xs text-center border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-taupe-600"
            />
            <span className="text-xs text-stone-400 dark:text-stone-500">min</span>
            {(event.delay_mins || 0) > 0 && (
              <button onClick={() => { setDelayInput('0'); onSetDelay(event.id, 0) }} className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 underline">
                reset
              </button>
            )}
          </div>

          {editing && (
            <EventEditForm event={event} onSave={handleSave} onCancel={() => setEditing(false)} />
          )}
        </div>
      </div>
    </div>
  )
}

function AddEventForm({ onAdd }) {
  const EMPTY = { title: '', start_time: '', duration_mins: 30, buffer_mins: 0, location: '', category: 'general', notes: '' }
  const [open, setOpen]   = useState(false)
  const [form, setForm]   = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.start_time) return
    setSaving(true)
    try { await onAdd(form); setForm(EMPTY); setOpen(false) }
    finally { setSaving(false) }
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full flex items-center gap-2 px-4 py-3 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-xl text-stone-400 dark:text-stone-500 hover:border-taupe-600 hover:text-taupe-600 transition-colors text-sm mt-2">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 3v10M3 8h10" /></svg>
      Add event
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800 rounded-xl shadow-sm p-4 mt-2 space-y-3">
      <input placeholder="Event title *" value={form.title} onChange={e => set('title', e.target.value)} autoFocus className={`w-full ${INPUT}`} />
      <div className="flex gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-stone-400 dark:text-stone-500">Start time</label>
          <input type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} className={INPUT} />
        </div>
        <DurationInput value={form.duration_mins} onChange={v => set('duration_mins', v)} />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-stone-400 dark:text-stone-500">Buffer after (min)</label>
          <input type="number" min={0} value={form.buffer_mins} onChange={e => set('buffer_mins', Number(e.target.value))} className={`w-32 ${INPUT}`} />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <input placeholder="Location" value={form.location} onChange={e => set('location', e.target.value)} className={`flex-1 ${INPUT}`} />
        <select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
        </select>
      </div>
      <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Details (optional) — e.g. who gives a speech, song for first dance…" rows={2} className={`w-full ${INPUT} resize-none`} />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-stone-400 dark:text-stone-500 px-3 py-1.5 hover:text-stone-600 dark:hover:text-stone-300">Cancel</button>
        <button type="submit" disabled={saving} className="text-sm bg-taupe-600 text-white px-4 py-1.5 rounded-lg hover:bg-taupe-700 disabled:opacity-40 transition-colors">{saving ? 'Adding…' : 'Add event'}</button>
      </div>
    </form>
  )
}

export function TimelinePage() {
  const { events, loading, error, setDelay, updateEvent, addEvent, deleteEvent } = useTimeline()
  const [activeFilter, setActiveFilter] = useState('all')
  const { hiddenIds, pendingDelete, requestDelete, undoDelete } = useDeleteUndo(deleteEvent)

  function handleDeleteEvent(id) {
    const label = events.find(e => e.id === id)?.title ?? 'Event'
    requestDelete(id, label)
  }

  const shownEvents   = events.filter(e => !hiddenIds.has(e.id))
  const delayed  = shownEvents.filter(e => e.status === 'delayed').length
  const buffered = shownEvents.filter(e => e.status === 'buffered').length

  const visibleEvents = activeFilter === 'all'
    ? shownEvents
    : shownEvents.filter(e => e.category === activeFilter)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100">Day-of Timeline</h2>
        <div className="flex gap-2 text-xs">
          {delayed  > 0 && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">{delayed} ripple{delayed > 1 ? 's' : ''}</span>}
          {buffered > 0 && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">{buffered} buffered</span>}
          {delayed === 0 && buffered === 0 && shownEvents.length > 0 && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">On schedule</span>}
        </div>
      </div>
      <p className="text-xs text-stone-400 dark:text-stone-500 mb-4">Hover any event to edit details or set delays. Ripple shows downstream impact.</p>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              activeFilter === f.id
                ? 'bg-taupe-600 text-white'
                : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-600'
            }`}
          >
            {f.label}
            {f.id !== 'all' && (
              <span className="ml-1.5 opacity-60">{shownEvents.filter(e => e.category === f.id).length}</span>
            )}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-stone-400 text-center py-8">Loading timeline…</p>}
      {error   && <p className="text-sm text-red-400 text-center py-8">{error}</p>}

      {!loading && !error && (
        <div className="space-y-2">
          {visibleEvents.length === 0 && (
            <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-8">No events in this category.</p>
          )}
          {visibleEvents.map(ev => (
            <EventCard key={ev.id} event={ev} onSetDelay={setDelay} onUpdate={updateEvent} onDelete={handleDeleteEvent} />
          ))}
          {activeFilter === 'all' && <AddEventForm onAdd={addEvent} />}
        </div>
      )}
      {pendingDelete && <UndoToast label={pendingDelete.label} onUndo={undoDelete} />}
    </div>
  )
}
