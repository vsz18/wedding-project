import { useState, useRef, useEffect } from 'react'
import { useMakeup } from '../hooks/useMakeup.js'
import { useBridesmaids } from '../hooks/useBridesmaids.js'

/* ─── constants ────────────────────────────────────────────── */
function fmt(t) {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const p = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${p}`
}

const ROLE_COLORS = {
  bride:      'bg-white text-stone-600 border border-stone-300',
  moh:        'bg-[#d0dfc8] text-[#3a5c30]',
  bridesmaid: 'bg-pink-200 text-pink-700',
}
const ROLE_LABELS = { bride: 'Bride', moh: 'MOH', bridesmaid: 'Bridesmaid' }

const BRIDESMAIDS = [
  'Ashley Reed',
  'Anyssa Chebbi',
  'Margaret Li',
  'Ayushi Sinha',
  'Katherine Herbout',
  'Valerie Wilson',
]

/* ─── assignee helpers ─────────────────────────────────────── */
function parseAssignees(raw) {
  if (!raw || raw === 'all') return ['all']
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}
function serializeAssignees(list) {
  if (!list.length || list.includes('all')) return 'all'
  return list.join(',')
}

/* Assignee chip(s) shown on the task row (collapsed) */
function AssigneeChips({ raw }) {
  const list = parseAssignees(raw)
  if (list.includes('all')) return null
  const show  = list.slice(0, 2)
  const extra = list.length - 2
  return (
    <div className="flex items-center gap-1">
      {show.map(name => (
        <span key={name} className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-medium whitespace-nowrap">
          {name.split(' ')[0]}
        </span>
      ))}
      {extra > 0 && (
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 font-medium">+{extra}</span>
      )}
    </div>
  )
}

/* Dropdown multi-select picker */
function AssigneePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = parseAssignees(value)
  const isAll = selected.includes('all')

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleAll() { onChange('all') }

  function togglePerson(name) {
    const current = isAll ? [] : [...selected]
    const next = current.includes(name)
      ? current.filter(n => n !== name)
      : [...current, name]
    onChange(next.length ? serializeAssignees(next) : 'all')
  }

  const label = isAll
    ? 'Everyone'
    : selected.length === 1
    ? selected[0].split(' ')[0]
    : `${selected.length} people`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="text-xs bg-stone-100 rounded-md px-2 py-1.5 text-stone-600 flex items-center gap-1.5 hover:bg-stone-200 transition-colors whitespace-nowrap"
      >
        <svg className="w-3 h-3 text-stone-400" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="5" cy="4" r="2.5"/><path strokeLinecap="round" d="M1 10.5c0-2.2 1.8-4 4-4m3 3v3m1.5-1.5H7"/></svg>
        {label}
        <svg className="w-3 h-3 text-stone-400" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 4l3 3 3-3"/></svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-stone-200 rounded-xl shadow-lg py-1 min-w-[170px]">
          {/* All option */}
          <label className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 cursor-pointer">
            <input
              type="checkbox"
              checked={isAll}
              onChange={toggleAll}
              className="accent-taupe-600 w-3.5 h-3.5"
            />
            <span className="text-xs font-medium text-stone-700">Everyone</span>
          </label>
          <div className="border-t border-stone-100 my-1" />
          {BRIDESMAIDS.map(name => (
            <label key={name} className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 cursor-pointer">
              <input
                type="checkbox"
                checked={!isAll && selected.includes(name)}
                onChange={() => togglePerson(name)}
                className="accent-taupe-600 w-3.5 h-3.5"
              />
              <span className="text-xs text-stone-700">{name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Makeup slot row ──────────────────────────────────────── */
function MakeupSlotRow({ slot, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState(slot)
  const [saving, setSaving]   = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSave() {
    setSaving(true)
    try {
      await onUpdate(slot.id, { ...form, start_time: form.start_time?.slice(0,5), end_time: form.end_time?.slice(0,5) })
      setEditing(false)
    } finally { setSaving(false) }
  }

  if (editing) {
    return (
      <tr className="bg-stone-50">
        <td className="px-3 py-2">
          <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full text-sm border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-taupe-600" />
        </td>
        <td className="px-3 py-2">
          <select value={form.role} onChange={e => set('role', e.target.value)} className="text-xs border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-taupe-600">
            <option value="bridesmaid">Bridesmaid</option>
            <option value="moh">MOH</option>
            <option value="bride">Bride</option>
          </select>
        </td>
        <td className="px-3 py-2">
          <input type="time" value={form.start_time?.slice(0,5)} onChange={e => set('start_time', e.target.value)} className="text-sm border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-taupe-600" />
        </td>
        <td className="px-3 py-2">
          <input type="time" value={form.end_time?.slice(0,5)} onChange={e => set('end_time', e.target.value)} className="text-sm border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-taupe-600" />
        </td>
        <td className="px-3 py-2">
          <select value={form.artist_chair} onChange={e => set('artist_chair', Number(e.target.value))} className="text-xs border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-taupe-600">
            <option value={1}>Chair 1</option>
            <option value={2}>Chair 2</option>
          </select>
        </td>
        <td className="px-3 py-2">
          <input value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Notes" className="w-full text-sm border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-taupe-600" />
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <button onClick={handleSave} disabled={saving} className="text-xs text-taupe-600 font-medium hover:text-taupe-700 mr-2">{saving ? '…' : 'Save'}</button>
          <button onClick={() => { setForm(slot); setEditing(false) }} className="text-xs text-stone-400 hover:text-stone-600">Cancel</button>
        </td>
      </tr>
    )
  }

  return (
    <tr className="group hover:bg-stone-50 transition-colors">
      <td className="px-3 py-2.5 text-sm font-medium text-stone-800">{slot.name}</td>
      <td className="px-3 py-2.5">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[slot.role] || ROLE_COLORS.bridesmaid}`}>
          {ROLE_LABELS[slot.role] || slot.role}
        </span>
      </td>
      <td className="px-3 py-2.5 text-sm text-stone-600 tabular-nums">{fmt(slot.start_time)}</td>
      <td className="px-3 py-2.5 text-sm text-stone-600 tabular-nums">{fmt(slot.end_time)}</td>
      <td className="px-3 py-2.5">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${slot.artist_chair === 1 ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'}`}>
          Chair {slot.artist_chair}
        </span>
      </td>
      <td className="px-3 py-2.5 text-xs text-stone-400 max-w-[160px] truncate">{slot.notes || '—'}</td>
      <td className="px-3 py-2.5 whitespace-nowrap">
        <button
          onClick={() => { setForm({ ...slot, start_time: slot.start_time?.slice(0,5), end_time: slot.end_time?.slice(0,5) }); setEditing(true) }}
          className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-taupe-600 transition-all mr-2"
          aria-label="Edit"
        >
          <svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 1.5l3 3-7 7H2.5v-3l7-7z"/></svg>
        </button>
        <button onClick={() => onDelete(slot.id)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all" aria-label="Delete">
          <svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8 8M11 3l-8 8"/></svg>
        </button>
      </td>
    </tr>
  )
}

function AddMakeupSlotRow({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', role: 'bridesmaid', start_time: '', end_time: '', artist_chair: 1, notes: '' })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleAdd() {
    if (!form.name || !form.start_time || !form.end_time) return
    setSaving(true)
    try {
      await onAdd(form)
      setForm({ name: '', role: 'bridesmaid', start_time: '', end_time: '', artist_chair: 1, notes: '' })
      setOpen(false)
    } finally { setSaving(false) }
  }

  if (!open) return (
    <tr>
      <td colSpan={7} className="px-3 py-2">
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-taupe-600 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 2v10M2 7h10"/></svg>
          Add person
        </button>
      </td>
    </tr>
  )

  return (
    <tr className="bg-stone-50">
      <td className="px-3 py-2"><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Name *" autoFocus className="w-full text-sm border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-taupe-600" /></td>
      <td className="px-3 py-2"><select value={form.role} onChange={e => set('role', e.target.value)} className="text-xs border border-stone-200 rounded px-2 py-1"><option value="bridesmaid">Bridesmaid</option><option value="moh">MOH</option><option value="bride">Bride</option></select></td>
      <td className="px-3 py-2"><input type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} className="text-sm border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-taupe-600" /></td>
      <td className="px-3 py-2"><input type="time" value={form.end_time} onChange={e => set('end_time', e.target.value)} className="text-sm border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-taupe-600" /></td>
      <td className="px-3 py-2"><select value={form.artist_chair} onChange={e => set('artist_chair', Number(e.target.value))} className="text-xs border border-stone-200 rounded px-2 py-1"><option value={1}>Chair 1</option><option value={2}>Chair 2</option></select></td>
      <td className="px-3 py-2"><input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notes" className="w-full text-sm border border-stone-200 rounded px-2 py-1" /></td>
      <td className="px-3 py-2 whitespace-nowrap">
        <button onClick={handleAdd} disabled={saving} className="text-xs text-taupe-600 font-medium mr-2">{saving ? '…' : 'Add'}</button>
        <button onClick={() => setOpen(false)} className="text-xs text-stone-400">Cancel</button>
      </td>
    </tr>
  )
}

/* ─── Bridesmaids task item ────────────────────────────────── */
function BTaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft]     = useState(task.title)
  const [expanded, setExpanded]         = useState(false)
  const [assigneeDraft, setAssigneeDraft] = useState(task.assignee ?? 'all')
  const [dueDayDraft, setDueDayDraft]   = useState(task.due_day ?? '')
  const [dueTimeDraft, setDueTimeDraft] = useState(task.due_time ?? '')

  function handleTitleBlur() {
    setEditingTitle(false)
    const t = titleDraft.trim()
    if (t && t !== task.title) onUpdate(task, { title: t })
    else setTitleDraft(task.title)
  }

  function handleMetaSave() {
    onUpdate(task, {
      assignee: assigneeDraft,
      due_day:  dueDayDraft !== '' ? Number(dueDayDraft) : null,
      due_time: dueTimeDraft || null,
    })
    setExpanded(false)
  }

  function handleExpandToggle() {
    setExpanded(p => !p)
    setAssigneeDraft(task.assignee ?? 'all')
    setDueDayDraft(task.due_day ?? '')
    setDueTimeDraft(task.due_time ?? '')
  }

  const dueLabel = task.due_time
    ? task.due_time
    : task.due_day != null
    ? `Day ${task.due_day}`
    : null

  return (
    <li className="group px-3 py-2.5">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle(task)}
          className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-taupe-600 border-taupe-600' : 'border-stone-300 hover:border-taupe-600'}`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5" />
            </svg>
          )}
        </button>

        {editingTitle ? (
          <input
            value={titleDraft}
            onChange={e => setTitleDraft(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setTitleDraft(task.title); setEditingTitle(false) } }}
            autoFocus
            className="flex-1 text-sm border-b border-taupe-600 outline-none bg-transparent"
          />
        ) : (
          <span
            onClick={() => { setTitleDraft(task.title); setEditingTitle(true) }}
            className={`flex-1 text-sm cursor-text ${task.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}
          >
            {task.title}
          </span>
        )}

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!expanded && <AssigneeChips raw={task.assignee} />}
          {dueLabel && !expanded && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-taupe-50 text-taupe-600 font-medium whitespace-nowrap">
              {dueLabel}
            </span>
          )}
          <button
            onClick={handleExpandToggle}
            className={`transition-all ${expanded ? 'text-taupe-600' : 'opacity-0 group-hover:opacity-100 text-stone-300 hover:text-stone-500'}`}
            aria-label="Edit details"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 1.5l3 3-7 7H2.5v-3l7-7z"/>
            </svg>
          </button>
          <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all" aria-label="Delete">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8 8M11 3l-8 8"/>
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 ml-6 flex items-center gap-2 flex-wrap">
          <AssigneePicker value={assigneeDraft} onChange={setAssigneeDraft} />
          <input
            type="number" min={1} max={30}
            placeholder="Due day"
            value={dueDayDraft}
            onChange={e => setDueDayDraft(e.target.value)}
            className="text-xs bg-stone-100 border-none rounded-md px-2 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-taupe-600 text-stone-600"
          />
          <input
            value={dueTimeDraft}
            onChange={e => setDueTimeDraft(e.target.value)}
            placeholder="Due time (e.g. 1:00 PM)"
            className="text-xs bg-stone-100 border-none rounded-md px-2 py-1.5 w-44 focus:outline-none focus:ring-2 focus:ring-taupe-600 text-stone-600"
          />
          <button onClick={handleMetaSave} className="text-xs bg-taupe-600 text-white px-3 py-1.5 rounded-md hover:bg-taupe-700 transition-colors">
            Save
          </button>
          <button onClick={() => setExpanded(false)} className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1.5">
            Cancel
          </button>
        </div>
      )}
    </li>
  )
}

function AddBTaskRow({ onAdd }) {
  const [open, setOpen]   = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!draft.trim()) return
    setSaving(true)
    try { await onAdd({ title: draft.trim(), assignee: 'all' }); setDraft('') }
    finally { setSaving(false) }
  }

  if (!open) return (
    <li className="px-3 py-2">
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-taupe-600 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 2v10M2 7h10"/></svg>
        Add task
      </button>
    </li>
  )

  return (
    <li className="px-3 py-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Task title…" autoFocus className="flex-1 text-sm outline-none border-b border-taupe-600 bg-transparent py-0.5" />
        <button type="submit" disabled={saving} className="text-xs text-taupe-600 font-medium">{saving ? '…' : 'Add'}</button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-stone-400">Cancel</button>
      </form>
    </li>
  )
}

/* ─── Page ─────────────────────────────────────────────────── */
export function BridesmaidsPage() {
  const { slots, loading: makeupLoading, error: makeupError, addSlot, updateSlot, deleteSlot } = useMakeup()
  const { tasks, loading: tasksLoading, error: tasksError, addTask, toggleTask, updateTask, deleteTask } = useBridesmaids()

  const chair1 = slots.filter(s => s.artist_chair === 1)
  const chair2 = slots.filter(s => s.artist_chair === 2)
  const completedTasks = tasks.filter(t => t.completed).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-10">

      {/* ── Makeup Schedule ─────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-2xl text-stone-800">Makeup Schedule</h2>
          <span className="text-xs text-stone-400">Glamsquad · Faculty House · 8:15 AM</span>
        </div>
        <p className="text-xs text-stone-400 mb-4">Two artists working simultaneously. Hover a row to edit or delete.</p>

        {makeupLoading && <p className="text-sm text-stone-400 py-4">Loading…</p>}
        {makeupError   && <p className="text-sm text-red-400 py-4">{makeupError}</p>}

        {!makeupLoading && !makeupError && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-stone-100">
                <tr>
                  {['Name','Role','Start','End','Chair','Notes',''].map(h => (
                    <th key={h} className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {slots.map(slot => (
                  <MakeupSlotRow key={slot.id} slot={slot} onUpdate={updateSlot} onDelete={deleteSlot} />
                ))}
                <AddMakeupSlotRow onAdd={addSlot} />
              </tbody>
            </table>

            <div className="flex gap-6 px-4 py-3 border-t border-stone-100 bg-stone-50 text-xs text-stone-400">
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-200 mr-1.5" />Chair 1 · Brianna C ({chair1.length} people)</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-violet-200 mr-1.5" />Chair 2 · Fjorela P ({chair2.length} people)</span>
            </div>
          </div>
        )}
      </section>

      {/* ── Bridesmaids Tasks ───────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-2xl text-stone-800">Bridesmaids Tasks</h2>
          <span className="text-xs text-stone-400">{completedTasks}/{tasks.length} done</span>
        </div>
        <p className="text-xs text-stone-400 mb-4">Click a title to rename. Hover to assign people, set a due day, or a due time.</p>

        {tasksLoading && <p className="text-sm text-stone-400 py-4">Loading…</p>}
        {tasksError   && <p className="text-sm text-red-400 py-4">{tasksError}</p>}

        {!tasksLoading && !tasksError && (
          <div className="bg-white rounded-xl shadow-sm">
            <ul className="divide-y divide-stone-100">
              {tasks.map(task => (
                <BTaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              ))}
              <AddBTaskRow onAdd={addTask} />
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
