import { useState } from 'react'
import { useVendors } from '../hooks/useVendors.js'

const CATEGORIES = ['ceremony_venue','reception_venue','photography','dj','music','florals','beauty','catering','other']
const CATEGORY_LABELS = {
  ceremony_venue:  'Ceremony Venue',
  reception_venue: 'Reception Venue',
  photography:     'Photography',
  dj:              'DJ',
  music:           'Music',
  florals:         'Florals',
  beauty:          'Hair & Makeup',
  catering:        'Catering',
  other:           'Other',
}
const CATEGORY_COLORS = {
  ceremony_venue:  'bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  reception_venue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  photography:     'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  dj:              'bg-pink-50 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  music:           'bg-pink-50 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  florals:         'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  beauty:          'bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  catering:        'bg-orange-50 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  other:           'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300',
}

const INPUT = 'w-full text-sm border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 dark:text-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-taupe-600'

function fmt24to12(t) {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const p = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${p}`
}

function VendorCard({ vendor, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState(vendor)
  const [saving, setSaving]   = useState(false)

  function set(k, v) { setForm(p => ({...p, [k]: v})) }

  async function handleSave() {
    setSaving(true)
    try { await onUpdate(vendor.id, form); setEditing(false) }
    finally { setSaving(false) }
  }

  if (editing) {
    return (
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-stone-400 dark:text-stone-500 block mb-1">Contact Name</label>
            <input value={form.name || ''} onChange={e => set('name', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="text-xs text-stone-400 dark:text-stone-500 block mb-1">Company</label>
            <input value={form.company || ''} onChange={e => set('company', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="text-xs text-stone-400 dark:text-stone-500 block mb-1">Phone</label>
            <input value={form.phone || ''} onChange={e => set('phone', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="text-xs text-stone-400 dark:text-stone-500 block mb-1">Email</label>
            <input value={form.email || ''} onChange={e => set('email', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="text-xs text-stone-400 dark:text-stone-500 block mb-1">Arrival Time</label>
            <input type="time" value={form.arrival_time ? form.arrival_time.slice(0,5) : ''} onChange={e => set('arrival_time', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="text-xs text-stone-400 dark:text-stone-500 block mb-1">Location</label>
            <input value={form.location || ''} onChange={e => set('location', e.target.value)} className={INPUT} />
          </div>
        </div>
        <div>
          <label className="text-xs text-stone-400 dark:text-stone-500 block mb-1">Category</label>
          <select value={form.category || 'other'} onChange={e => set('category', e.target.value)} className={INPUT}>
            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-stone-400 dark:text-stone-500 block mb-1">Notes</label>
          <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={2} className={`${INPUT} resize-none`} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={() => { setForm(vendor); setEditing(false) }} className="text-sm text-stone-400 dark:text-stone-500 px-3 py-1.5 hover:text-stone-600 dark:hover:text-stone-300">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="text-sm bg-taupe-600 text-white px-4 py-1.5 rounded-lg hover:bg-taupe-700 disabled:opacity-40 transition-colors">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white dark:bg-stone-800 rounded-xl shadow-sm p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-stone-800 dark:text-stone-100 text-sm">{vendor.name}</span>
            {vendor.company && <span className="text-xs text-stone-400 dark:text-stone-500">{vendor.company}</span>}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[vendor.category] || CATEGORY_COLORS.other}`}>
              {CATEGORY_LABELS[vendor.category] || vendor.category}
            </span>
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
            {vendor.phone && (
              <a href={`tel:${vendor.phone}`} className="flex items-center gap-1 hover:text-taupe-600 transition-colors">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2 2c0 5.523 4.477 10 10 10V8l-2.5-.5-1 1.5C7 8.5 5.5 7 5 5.5L6.5 4.5 6 2H2z" /></svg>
                {vendor.phone}
              </a>
            )}
            {vendor.email && (
              <a href={`mailto:${vendor.email}`} className="flex items-center gap-1 hover:text-taupe-600 transition-colors truncate">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}><rect x="1" y="2.5" width="10" height="7" rx="1" /><path d="M1 3l5 3.5L11 3" strokeLinecap="round" /></svg>
                {vendor.email}
              </a>
            )}
            {vendor.arrival_time && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}><circle cx="6" cy="6" r="5"/><path d="M6 3v3l2 1.5" strokeLinecap="round" /></svg>
                Arrives {fmt24to12(vendor.arrival_time)}
              </span>
            )}
            {vendor.location && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 1a3.5 3.5 0 013.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 016 1z"/><circle cx="6" cy="4.5" r="1" /></svg>
                {vendor.location}
              </span>
            )}
          </div>

          {vendor.notes && <p className="mt-2 text-xs text-stone-400 dark:text-stone-500 leading-relaxed">{vendor.notes}</p>}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="text-stone-400 dark:text-stone-500 hover:text-taupe-600 transition-colors" aria-label="Edit vendor">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 2l3 3-8 8H3v-3l8-8z"/></svg>
          </button>
          <button onClick={() => onDelete(vendor.id)} className="text-stone-300 dark:text-stone-600 hover:text-red-400 transition-colors" aria-label="Delete vendor">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8M12 4l-8 8"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

const BLANK = { name: '', company: '', phone: '', email: '', arrival_time: '', location: '', category: 'other', notes: '' }

function AddVendorForm({ onAdd }) {
  const [open, setOpen]     = useState(false)
  const [form, setForm]     = useState(BLANK)
  const [saving, setSaving] = useState(false)

  function set(k, v) { setForm(p => ({...p, [k]: v})) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try { await onAdd(form); setForm(BLANK); setOpen(false) }
    finally { setSaving(false) }
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full flex items-center gap-2 px-4 py-3 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-xl text-stone-400 dark:text-stone-500 hover:border-taupe-600 hover:text-taupe-600 transition-colors text-sm mt-2">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 3v10M3 8h10"/></svg>
      Add vendor
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800 rounded-xl shadow-sm p-4 mt-2 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input placeholder="Contact name *" value={form.name} onChange={e => set('name', e.target.value)} autoFocus className={INPUT} />
        <input placeholder="Company"         value={form.company} onChange={e => set('company', e.target.value)} className={INPUT} />
        <input placeholder="Phone"           value={form.phone}   onChange={e => set('phone', e.target.value)}   className={INPUT} />
        <input placeholder="Email"           value={form.email}   onChange={e => set('email', e.target.value)}   className={INPUT} />
        <input type="time"                   value={form.arrival_time} onChange={e => set('arrival_time', e.target.value)} className={INPUT} />
        <input placeholder="Location"        value={form.location} onChange={e => set('location', e.target.value)} className={INPUT} />
      </div>
      <select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>
        {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
      </select>
      <textarea placeholder="Notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className={`${INPUT} resize-none`} />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-stone-400 dark:text-stone-500 px-3 py-1.5 hover:text-stone-600 dark:hover:text-stone-300">Cancel</button>
        <button type="submit" disabled={saving} className="text-sm bg-taupe-600 text-white px-4 py-1.5 rounded-lg hover:bg-taupe-700 disabled:opacity-40 transition-colors">{saving ? 'Saving…' : 'Add vendor'}</button>
      </div>
    </form>
  )
}

export function VendorsPage() {
  const { vendors, loading, error, addVendor, updateVendor, deleteVendor } = useVendors()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100">Vendors</h2>
        <span className="text-xs text-stone-400 dark:text-stone-500">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''}</span>
      </div>

      {loading && <p className="text-sm text-stone-400 text-center py-8">Loading vendors…</p>}
      {error   && <p className="text-sm text-red-400 text-center py-8">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {vendors.map(v => (
            <VendorCard key={v.id} vendor={v} onUpdate={updateVendor} onDelete={deleteVendor} />
          ))}
          <AddVendorForm onAdd={addVendor} />
        </div>
      )}
    </div>
  )
}
