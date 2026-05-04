import { useState, useRef, useEffect } from 'react'
import { useTimeline } from '../hooks/useTimeline.js'
import { useTimelineAuth } from '../hooks/useTimelineAuth.js'
import { useDeleteUndo } from '../hooks/useDeleteUndo.js'
import { UndoToast } from '../components/UndoToast.jsx'

const CATEGORY_COLORS = {
  getting_ready:  'bg-pink-50 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  ceremony:       'bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  reception:      'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  photos:         'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  travel:         'bg-teal-50 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  cocktail_hour:  'bg-lime-50 text-lime-700 dark:bg-lime-900/50 dark:text-lime-300',
  food:           'bg-orange-50 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  vendor_arrival: 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300',
  rehearsal:      'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  general:        'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300',
}

const STATUS_STYLES = {
  'on-time':  { dot: 'bg-green-400',   card: '',                              badge: null },
  'early':    { dot: 'bg-emerald-400', card: 'border-l-4 border-emerald-300', badge: () => 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300', label: d => `Ahead ${Math.abs(d)}m` },
  'buffered': { dot: 'bg-yellow-400',  card: 'border-l-4 border-yellow-300', badge: () => 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300', label: d => `Buffer absorbing +${d}m` },
  'delayed':  { dot: 'bg-orange-500',  card: 'border-l-4 border-orange-400', badge: () => 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300', label: d => `Ripple: +${d}m late` },
}

const FILTERS = [
  { id: 'all',            label: 'All' },
  { id: 'getting_ready',  label: 'Getting Ready' },
  { id: 'ceremony',       label: 'Ceremony' },
  { id: 'reception',      label: 'Reception' },
  { id: 'photos',         label: 'Photos' },
  { id: 'cocktail_hour',  label: 'Cocktail Hour' },
  { id: 'food',           label: 'Food' },
  { id: 'travel',         label: 'Travel' },
  { id: 'rehearsal',      label: 'Rehearsal' },
  { id: 'vendor_arrival', label: 'Vendor Arrivals' },
]

const CATEGORY_OPTIONS = ['getting_ready','ceremony','cocktail_hour','food','reception','photos','travel','vendor_arrival','rehearsal','general']

const POINT_PERSON_OPTIONS = ['bride','bridesmaid','groom','family','guest','dj','photographer','venue','mac']
const POINT_PERSON_COLORS = {
  bride:        'bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  bridesmaid:   'bg-pink-50 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  groom:        'bg-sky-50 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  family:       'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  guest:        'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300',
  dj:           'bg-violet-50 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  photographer: 'bg-teal-50 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  venue:        'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  mac:          'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-300',
}

function parseCategories(raw) {
  if (!raw) return ['general']
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}
function serializeCategories(list) {
  return list.length ? list.join(',') : 'general'
}

function parsePointPersons(raw) {
  if (!raw) return []
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}
function serializePointPersons(list) {
  return list.join(',')
}

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

function CategoryPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = parseCategories(value)

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(cat) {
    const next = selected.includes(cat) ? selected.filter(c => c !== cat) : [...selected, cat]
    onChange(serializeCategories(next.length ? next : ['general']))
  }

  const label = selected.length === 1
    ? selected[0].replace(/_/g, ' ')
    : `${selected.length} categories`

  return (
    <div ref={ref} className="relative flex flex-col gap-0.5">
      <label className="text-xs text-stone-400 dark:text-stone-500">Category</label>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`${INPUT} flex items-center gap-1.5 capitalize`}
      >
        <span className="flex-1 text-left">{label}</span>
        <svg className="w-3 h-3 text-stone-400 flex-shrink-0" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 4l3 3 3-3"/>
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg py-1 min-w-[190px]">
          {CATEGORY_OPTIONS.map(cat => (
            <label key={cat} className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 dark:hover:bg-stone-700 cursor-pointer">
              <input type="checkbox" checked={selected.includes(cat)} onChange={() => toggle(cat)} className="accent-taupe-600 w-3.5 h-3.5" />
              <span className="text-xs text-stone-700 dark:text-stone-200 capitalize">{cat.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function PointPersonPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = parsePointPersons(value)

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(person) {
    const next = selected.includes(person) ? selected.filter(p => p !== person) : [...selected, person]
    onChange(serializePointPersons(next))
  }

  const label = selected.length === 0
    ? '—'
    : selected.length === 1
      ? (selected[0] === 'dj' ? 'DJ' : selected[0] === 'mac' ? 'MAC' : selected[0].charAt(0).toUpperCase() + selected[0].slice(1))
      : `${selected.length} people`

  return (
    <div ref={ref} className="relative flex flex-col gap-0.5">
      <label className="text-xs text-stone-400 dark:text-stone-500">Point person</label>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`${INPUT} flex items-center gap-1.5`}
      >
        <span className="flex-1 text-left">{label}</span>
        <svg className="w-3 h-3 text-stone-400 flex-shrink-0" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 4l3 3 3-3"/>
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg py-1 min-w-[160px]">
          {POINT_PERSON_OPTIONS.map(person => (
            <label key={person} className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 dark:hover:bg-stone-700 cursor-pointer">
              <input type="checkbox" checked={selected.includes(person)} onChange={() => toggle(person)} className="accent-taupe-600 w-3.5 h-3.5" />
              <span className="text-xs text-stone-700 dark:text-stone-200">{person === 'dj' ? 'DJ' : person === 'mac' ? 'MAC' : person.charAt(0).toUpperCase() + person.slice(1)}</span>
            </label>
          ))}
        </div>
      )}
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
    point_person:  event.point_person ?? '',
    locked:        event.locked ?? false,
  })
  const [saving, setSaving]     = useState(false)
  const [saveError, setSaveError] = useState(null)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try { await onSave(event.id, form) }
    catch { setSaveError('Save failed — check your connection and try again.') }
    finally { setSaving(false) }
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
        <CategoryPicker value={form.category} onChange={v => set('category', v)} />
        <PointPersonPicker value={form.point_person} onChange={v => set('point_person', v)} />
      </div>
      <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Details (optional)" rows={2} className={`w-full ${INPUT} resize-none`} />
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={form.locked} onChange={e => set('locked', e.target.checked)} className="accent-taupe-600 w-3.5 h-3.5" />
        <span className="text-xs text-stone-500 dark:text-stone-400">Lock to scheduled time <span className="text-stone-400 dark:text-stone-500">(ignores ripple)</span></span>
      </label>
      {saveError && <p className="text-xs text-red-500">{saveError}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="text-sm text-stone-400 dark:text-stone-500 px-3 py-1.5 hover:text-stone-600 dark:hover:text-stone-300">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="text-sm bg-taupe-600 text-white px-4 py-1.5 rounded-lg hover:bg-taupe-700 disabled:opacity-40 transition-colors">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function EventCard({ event, onSetDelay, onUpdate, onDelete, unlocked, selectMode = false, selected = false, onSelect }) {
  const [editing, setEditing]         = useState(false)
  const [showNotes, setShowNotes]     = useState(false)
  const savedDelay = event.delay_mins || 0
  const [lateInput,  setLateInput]  = useState(String(savedDelay > 0 ? savedDelay : 0))
  const [earlyInput, setEarlyInput] = useState(String(savedDelay < 0 ? -savedDelay : 0))
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const deleteTimerRef = useRef(null)

  function handleDeleteClick() {
    if (confirmingDelete) {
      clearTimeout(deleteTimerRef.current)
      onDelete(event.id)
    } else {
      setConfirmingDelete(true)
      deleteTimerRef.current = setTimeout(() => setConfirmingDelete(false), 2000)
    }
  }

  const st = STATUS_STYLES[event.status] || STATUS_STYLES['on-time']
  const isOffTime = event.status !== 'on-time'

  function handleLateBlur() {
    const val = Math.max(0, parseInt(lateInput, 10) || 0)
    setLateInput(String(val))
    setEarlyInput('0')
    if (val !== (event.delay_mins || 0)) onSetDelay(event.id, val)
  }

  function handleEarlyBlur() {
    const val = Math.max(0, parseInt(earlyInput, 10) || 0)
    setEarlyInput(String(val))
    setLateInput('0')
    const signed = val > 0 ? -val : 0
    if (signed !== (event.delay_mins || 0)) onSetDelay(event.id, signed)
  }

  async function handleSave(id, data) {
    await onUpdate(id, data)
    setEditing(false)
  }

  return (
    <div
      className={`group relative bg-white dark:bg-stone-800 rounded-xl shadow-sm p-4 ${st.card} ${selectMode ? 'cursor-pointer' : ''} ${selected ? 'ring-2 ring-taupe-600' : ''}`}
      onClick={selectMode ? onSelect : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Select checkbox */}
        {selectMode && (
          <div className={`flex-shrink-0 mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selected ? 'bg-taupe-600 border-taupe-600' : 'border-stone-300 dark:border-stone-600'}`}>
            {selected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5"/></svg>}
          </div>
        )}
        {/* Time column */}
        <div className="flex-shrink-0 w-16 sm:w-20 text-right">
          <span className={`text-sm font-medium ${isOffTime ? 'line-through text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'}`}>
            {event.scheduledDisplay}
          </span>
          {isOffTime && (
            <div className={`text-xs font-semibold ${event.status === 'early' ? 'text-emerald-500' : 'text-orange-500'}`}>{event.effectiveStartDisplay}</div>
          )}
        </div>

        <div className="flex-shrink-0 mt-1.5">
          <span className={`block w-2.5 h-2.5 rounded-full ${st.dot}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{event.title}</p>
                {event.locked && (
                  <svg className="w-3 h-3 text-stone-400 dark:text-stone-500 flex-shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="2" y="5.5" width="8" height="5" rx="1" />
                    <path strokeLinecap="round" d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
                  </svg>
                )}
              </div>
              {event.location && <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{event.location}</p>}
            </div>
            {unlocked && !selectMode && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setEditing(p => !p)}
                  aria-label="Edit event"
                  className={`transition-all ${editing ? 'text-taupe-600' : 'text-stone-300 dark:text-stone-600 hover:text-taupe-600 sm:opacity-0 sm:group-hover:opacity-100'}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 1.5l3 3-7 7H2.5v-3l7-7z" />
                  </svg>
                </button>
                <button
                  onClick={handleDeleteClick}
                  aria-label={confirmingDelete ? 'Confirm delete' : 'Delete event'}
                  className={`transition-all sm:opacity-0 sm:group-hover:opacity-100 ${confirmingDelete ? 'text-red-500 scale-110' : 'text-stone-300 dark:text-stone-600 hover:text-red-400'}`}
                >
                  {confirmingDelete ? (
                    <span className="text-xs font-medium leading-none">del?</span>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8 8M11 3l-8 8" />
                    </svg>
                  )}
                </button>
              </div>
            )}
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

          {/* Badges row — wraps freely on mobile */}
          {(event.point_person || event.category) && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {parsePointPersons(event.point_person).map(person => (
                <span key={person} className={`text-xs px-2 py-0.5 rounded-full font-medium ${POINT_PERSON_COLORS[person] || POINT_PERSON_COLORS.guest}`}>
                  {person === 'dj' ? 'DJ' : person === 'mac' ? 'MAC' : person.charAt(0).toUpperCase() + person.slice(1)}
                </span>
              ))}
              {parseCategories(event.category).map(cat => (
                <span key={cat} className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.general}`}>
                  {cat.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Notes dropdown */}
          {event.notes && showNotes && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed bg-stone-50 dark:bg-stone-700/50 rounded-lg px-3 py-2 whitespace-pre-wrap">
              {event.notes}
            </p>
          )}

          {/* Delay row — only visible when unlocked, not locked, and not in select mode */}
          {unlocked && !event.locked && !selectMode && (
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-stone-400 dark:text-stone-500">Late:</label>
                <input
                  type="number" min={0} max={120}
                  value={lateInput}
                  onChange={e => setLateInput(e.target.value)}
                  onBlur={handleLateBlur}
                  onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                  className="w-14 text-xs text-center border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-taupe-600"
                />
                <span className="text-xs text-stone-400 dark:text-stone-500">min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-emerald-500">Early:</label>
                <input
                  type="number" min={0} max={120}
                  value={earlyInput}
                  onChange={e => setEarlyInput(e.target.value)}
                  onBlur={handleEarlyBlur}
                  onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                  className="w-14 text-xs text-center border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-stone-700 dark:text-stone-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-xs text-stone-400 dark:text-stone-500">min</span>
              </div>
              {(event.delay_mins || 0) !== 0 && (
                <button onClick={() => { setLateInput('0'); setEarlyInput('0'); onSetDelay(event.id, 0) }} className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 underline">
                  reset
                </button>
              )}
            </div>
          )}

          {unlocked && editing && !selectMode && (
            <EventEditForm event={event} onSave={handleSave} onCancel={() => setEditing(false)} />
          )}
        </div>
      </div>
    </div>
  )
}

function AddEventForm({ onAdd }) {
  const EMPTY = { title: '', start_time: '', duration_mins: 30, buffer_mins: 0, location: '', category: 'general', notes: '', point_person: '', locked: false }
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
        <CategoryPicker value={form.category} onChange={v => set('category', v)} />
        <PointPersonPicker value={form.point_person} onChange={v => set('point_person', v)} />
      </div>
      <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Details (optional) — e.g. who gives a speech, song for first dance…" rows={2} className={`w-full ${INPUT} resize-none`} />
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={form.locked} onChange={e => set('locked', e.target.checked)} className="accent-taupe-600 w-3.5 h-3.5" />
        <span className="text-xs text-stone-500 dark:text-stone-400">Lock to scheduled time <span className="text-stone-400 dark:text-stone-500">(ignores ripple)</span></span>
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-stone-400 dark:text-stone-500 px-3 py-1.5 hover:text-stone-600 dark:hover:text-stone-300">Cancel</button>
        <button type="submit" disabled={saving} className="text-sm bg-taupe-600 text-white px-4 py-1.5 rounded-lg hover:bg-taupe-700 disabled:opacity-40 transition-colors">{saving ? 'Adding…' : 'Add event'}</button>
      </div>
    </form>
  )
}

export function TimelinePage({ personFilter = null }) {
  const { events, loading, error, setDelay, updateEvent, addEvent, deleteEvent } = useTimeline()
  const { unlocked, unlock, lock, error: pinError, clearError } = useTimelineAuth()
  const [activeFilter, setActiveFilter] = useState('all')
  const [activePerson, setActivePerson] = useState(personFilter || 'all')
  const [searchQuery, setSearchQuery]   = useState('')
  const [showPinInput, setShowPinInput] = useState(false)
  const [pinDraft, setPinDraft]         = useState('')
  const { hiddenIds, pendingDelete, requestDelete, undoDelete } = useDeleteUndo(deleteEvent)

  const [selectMode,   setSelectMode]   = useState(false)
  const [selectedIds,  setSelectedIds]  = useState(new Set())
  const [bulkPerson,   setBulkPerson]   = useState('')
  const [bulkSaving,   setBulkSaving]   = useState(false)

  function toggleSelect(id) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function exitSelectMode() {
    setSelectMode(false)
    setSelectedIds(new Set())
    setBulkPerson('')
  }

  async function handleBulkApply() {
    if (!bulkPerson || selectedIds.size === 0) return
    setBulkSaving(true)
    try {
      await Promise.all([...selectedIds].map(id => {
        const ev = events.find(e => e.id === id)
        if (!ev) return null
        const existing = parsePointPersons(ev.point_person)
        const next = existing.includes(bulkPerson) ? existing : [...existing, bulkPerson]
        return updateEvent(id, {
          title: ev.title,
          start_time: ev.start_time?.slice(0, 5),
          duration_mins: ev.duration_mins,
          buffer_mins: ev.buffer_mins,
          location: ev.location ?? '',
          category: ev.category ?? 'general',
          delay_mins: ev.delay_mins ?? 0,
          notes: ev.notes ?? '',
          point_person: serializePointPersons(next),
          locked: ev.locked ?? false,
        })
      }))
      exitSelectMode()
    } finally {
      setBulkSaving(false)
    }
  }

  function handleDeleteEvent(id) {
    const label = events.find(e => e.id === id)?.title ?? 'Event'
    requestDelete(id, label)
  }

  function handleLockClick() {
    if (unlocked) {
      lock()
      setShowPinInput(false)
    } else {
      setShowPinInput(p => !p)
      setPinDraft('')
      clearError()
    }
  }

  function handlePinSubmit(e) {
    e.preventDefault()
    if (unlock(pinDraft)) {
      setShowPinInput(false)
      setPinDraft('')
    }
  }

  const shownEvents   = events.filter(e => !hiddenIds.has(e.id))
  const delayed  = shownEvents.filter(e => e.status === 'delayed').length
  const buffered = shownEvents.filter(e => e.status === 'buffered').length
  const early    = shownEvents.filter(e => e.status === 'early').length

  const q = searchQuery.trim().toLowerCase()
  const visibleEvents = shownEvents
    .filter(e => activeFilter === 'all' || parseCategories(e.category).includes(activeFilter))
    .filter(e => activePerson === 'all' || parsePointPersons(e.point_person).includes(activePerson))
    .filter(e => !q || e.title.toLowerCase().includes(q) || (e.location ?? '').toLowerCase().includes(q) || (e.notes ?? '').toLowerCase().includes(q))

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100">Day-of Timeline</h2>
          {unlocked && (
            <button
              onClick={() => selectMode ? exitSelectMode() : setSelectMode(true)}
              title={selectMode ? 'Cancel selection' : 'Select events to bulk-assign'}
              className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${selectMode ? 'bg-taupe-600 text-white' : 'text-stone-400 dark:text-stone-500 hover:text-taupe-600'}`}
            >
              {selectMode ? `${selectedIds.size} selected` : 'Select'}
            </button>
          )}
          <button
            onClick={handleLockClick}
            aria-label={unlocked ? 'Lock timeline editing' : 'Unlock timeline editing'}
            title={unlocked ? 'Lock editing' : 'Unlock to edit'}
            className={`transition-colors ${unlocked ? 'text-taupe-600 hover:text-taupe-700' : 'text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400'}`}
          >
            {unlocked ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
                <rect x="3" y="9" width="14" height="9" rx="2" />
                <path strokeLinecap="round" d="M7 9V6a3 3 0 0 1 6 0" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
                <rect x="3" y="9" width="14" height="9" rx="2" />
                <path strokeLinecap="round" d="M7 9V6a3 3 0 0 1 6 0v3" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex gap-2 text-xs">
          {delayed  > 0 && <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 rounded-full font-medium">{delayed} ripple{delayed > 1 ? 's' : ''}</span>}
          {buffered > 0 && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 rounded-full font-medium">{buffered} buffered</span>}
          {early    > 0 && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-full font-medium">{early} ahead</span>}
          {delayed === 0 && buffered === 0 && early === 0 && shownEvents.length > 0 && <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 rounded-full font-medium">On schedule</span>}
        </div>
      </div>

      {/* PIN input */}
      {!unlocked && showPinInput && (
        <form onSubmit={handlePinSubmit} className="flex items-center gap-2 mb-3">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pinDraft}
            onChange={e => { setPinDraft(e.target.value); clearError() }}
            placeholder="Enter PIN"
            autoFocus
            className="w-32 text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-taupe-600"
          />
          <button type="submit" className="text-sm bg-taupe-600 text-white px-3 py-1.5 rounded-lg hover:bg-taupe-700 transition-colors">
            Unlock
          </button>
          {pinError && <span className="text-xs text-red-400">Incorrect PIN</span>}
        </form>
      )}

      <p className="text-xs text-stone-400 dark:text-stone-500 mb-3">
        {unlocked ? 'Tap the pencil icon to edit an event or set delays. Ripple shows downstream impact.' : 'View-only — tap the lock icon to edit.'}
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-stone-500 pointer-events-none" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
          <circle cx="6" cy="6" r="4"/><path strokeLinecap="round" d="M10 10l2.5 2.5"/>
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search events…"
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 dark:text-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-taupe-600 placeholder:text-stone-400 dark:placeholder:text-stone-500"
        />
      </div>

      {/* Category filter */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1.5">Category</p>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(f => {
            const count = f.id !== 'all'
              ? shownEvents
                  .filter(e => !personFilter || parsePointPersons(e.point_person).includes(personFilter))
                  .filter(e => parseCategories(e.category).includes(f.id))
                  .length
              : null
            if (personFilter && f.id !== 'all' && count === 0) return null
            return (
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
                {count !== null && <span className="ml-1.5 opacity-60">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Point person filter — hidden when a role is pre-set via personFilter */}
      {!personFilter && <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1.5">Point Person</p>
        <div className="flex gap-1.5 flex-wrap">
          {['all', ...POINT_PERSON_OPTIONS].map(p => {
            const label = p === 'all' ? 'Everyone' : p === 'dj' ? 'DJ' : p === 'mac' ? 'MAC' : p.charAt(0).toUpperCase() + p.slice(1)
            const count = p !== 'all' ? shownEvents.filter(e => parsePointPersons(e.point_person).includes(p)).length : null
            if (p !== 'all' && count === 0) return null
            return (
              <button
                key={p}
                onClick={() => setActivePerson(p)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activePerson === p
                    ? 'bg-stone-600 text-white dark:bg-stone-400 dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-600'
                }`}
              >
                {label}
                {count !== null && <span className="ml-1.5 opacity-60">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>}

      {loading && <p className="text-sm text-stone-400 text-center py-8">Loading timeline…</p>}
      {error   && <p className="text-sm text-red-400 text-center py-8">{error}</p>}

      {!loading && !error && (() => {
        const rehearsalEvents = visibleEvents.filter(e => parseCategories(e.category).includes('rehearsal'))
        const weddingEvents   = visibleEvents.filter(e => !parseCategories(e.category).includes('rehearsal'))
        const hasRehearsal    = rehearsalEvents.length > 0

        return (
          <div className="space-y-2">
            {activeFilter === 'all' && unlocked && <AddEventForm onAdd={addEvent} />}
            {visibleEvents.length === 0 && (
              <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-8">No events match these filters.</p>
            )}

            {hasRehearsal && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 pt-2 pb-1">
                  May 29 · Rehearsal
                </p>
                {rehearsalEvents.map(ev => (
                  <EventCard key={ev.id} event={ev} onSetDelay={setDelay} onUpdate={updateEvent} onDelete={handleDeleteEvent} unlocked={unlocked} selectMode={selectMode} selected={selectedIds.has(ev.id)} onSelect={() => toggleSelect(ev.id)} />
                ))}
                {weddingEvents.length > 0 && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 pt-4 pb-1">
                    May 30 · Wedding Day
                  </p>
                )}
              </>
            )}

            {weddingEvents.map(ev => (
              <EventCard key={ev.id} event={ev} onSetDelay={setDelay} onUpdate={updateEvent} onDelete={handleDeleteEvent} unlocked={unlocked} selectMode={selectMode} selected={selectedIds.has(ev.id)} onSelect={() => toggleSelect(ev.id)} />
            ))}
          </div>
        )
      })()}
      {pendingDelete && <UndoToast label={pendingDelete.label} onUndo={undoDelete} />}

      {/* Bulk assign bar */}
      {selectMode && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-lg">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
            <span className="text-xs text-stone-500 dark:text-stone-400 flex-shrink-0">
              {selectedIds.size === 0 ? 'Tap events to select' : `${selectedIds.size} event${selectedIds.size !== 1 ? 's' : ''} selected`}
            </span>
            <select
              value={bulkPerson}
              onChange={e => setBulkPerson(e.target.value)}
              className="flex-1 min-w-0 text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-taupe-600"
            >
              <option value="">Add point person…</option>
              {POINT_PERSON_OPTIONS.map(p => (
                <option key={p} value={p}>{p === 'dj' ? 'DJ' : p === 'mac' ? 'MAC' : p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
            <button
              onClick={handleBulkApply}
              disabled={bulkSaving || selectedIds.size === 0 || !bulkPerson}
              className="text-sm bg-taupe-600 text-white px-4 py-1.5 rounded-lg hover:bg-taupe-700 disabled:opacity-40 transition-colors flex-shrink-0"
            >
              {bulkSaving ? 'Saving…' : 'Apply'}
            </button>
            <button onClick={exitSelectMode} className="text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 flex-shrink-0">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
