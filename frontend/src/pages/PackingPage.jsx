import { useState } from 'react'
import { usePacking } from '../hooks/usePacking.js'

const PEOPLE = ['bride', 'groom', 'bridesmaids']
const SECTIONS = ['bridal_suite', 'ceremony', 'reception']

const PERSON_LABELS   = { bride: 'Bride', groom: 'Groom', bridesmaids: 'Bridesmaids' }
const SECTION_LABELS  = { bridal_suite: 'Bridal Suite', ceremony: 'Ceremony', reception: 'Reception' }
const PERSON_COLORS   = {
  bride:        'border-pink-200 text-pink-700',
  groom:        'border-blue-200 text-blue-700',
  bridesmaids:  'border-purple-200 text-purple-700',
}
const PERSON_ACTIVE   = {
  bride:        'bg-pink-600 text-white border-pink-600',
  groom:        'bg-blue-600 text-white border-blue-600',
  bridesmaids:  'bg-purple-600 text-white border-purple-600',
}

/** Inline editable item row */
function PackingItem({ item, onToggle, onDelete, onRename }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.title)

  function handleBlur() {
    setEditing(false)
    if (draft.trim() && draft !== item.title) onRename(item, draft.trim())
    else setDraft(item.title)
  }

  return (
    <li className="group flex items-center gap-2 py-2 px-3 hover:bg-stone-50 rounded-lg transition-colors">
      <button
        onClick={() => onToggle(item)}
        className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          item.packed ? 'bg-taupe-600 border-taupe-600' : 'border-stone-300 hover:border-taupe-600'
        }`}
        aria-label={item.packed ? 'Mark unpacked' : 'Mark packed'}
      >
        {item.packed && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5" />
          </svg>
        )}
      </button>

      {editing ? (
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setDraft(item.title); setEditing(false) } }}
          autoFocus
          className="flex-1 text-sm border-b border-taupe-600 outline-none bg-transparent"
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          className={`flex-1 text-sm cursor-text ${item.packed ? 'line-through text-stone-400' : 'text-stone-700'}`}
        >
          {item.title}
        </span>
      )}

      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all"
        aria-label="Delete item"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8 8M11 3l-8 8" />
        </svg>
      </button>
    </li>
  )
}

/** Add item inline form */
function AddItemRow({ person, section, onAdd }) {
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!draft.trim()) return
    setSaving(true)
    try {
      await onAdd({ title: draft.trim(), person, section })
      setDraft('')
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2">
      <svg className="w-4 h-4 text-stone-300 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v10M3 8h10" />
      </svg>
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="Add item…"
        className="flex-1 text-sm text-stone-600 placeholder-stone-300 outline-none bg-transparent"
      />
      {draft && (
        <button type="submit" disabled={saving} className="text-xs text-taupe-600 hover:text-taupe-700 font-medium flex-shrink-0">
          {saving ? '…' : 'Add'}
        </button>
      )}
    </form>
  )
}

export function PackingPage() {
  const { items, loading, error, togglePacked, addItem, deleteItem, renameItem } = usePacking()
  const [activePerson, setActivePerson] = useState('bride')

  const personItems = items.filter(i => i.person === activePerson)
  const packedCount = personItems.filter(i => i.packed).length
  const totalCount  = personItems.length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-stone-800">Packing Lists</h2>
        <span className="text-xs text-stone-400">{packedCount}/{totalCount} packed</span>
      </div>

      {/* Person tabs */}
      <div className="flex gap-2 mb-6">
        {PEOPLE.map(p => (
          <button
            key={p}
            onClick={() => setActivePerson(p)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
              activePerson === p ? PERSON_ACTIVE[p] : `bg-white ${PERSON_COLORS[p]} hover:bg-stone-50`
            }`}
          >
            {PERSON_LABELS[p]}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-stone-400 text-center py-8">Loading…</p>}
      {error   && <p className="text-sm text-red-400 text-center py-8">{error}</p>}

      {!loading && !error && SECTIONS.map(section => {
        const sectionItems = personItems.filter(i => i.section === section)
        return (
          <div key={section} className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 px-3">
              {SECTION_LABELS[section]}
              <span className="ml-2 font-normal normal-case text-stone-300">
                {sectionItems.filter(i => i.packed).length}/{sectionItems.length}
              </span>
            </h3>
            <div className="bg-white rounded-xl shadow-sm divide-y divide-stone-100">
              <ul>
                {sectionItems.map(item => (
                  <PackingItem
                    key={item.id}
                    item={item}
                    onToggle={togglePacked}
                    onDelete={deleteItem}
                    onRename={renameItem}
                  />
                ))}
              </ul>
              <AddItemRow person={activePerson} section={section} onAdd={addItem} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
