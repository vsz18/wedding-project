const TABS = [
  { id: 'tasks',        label: 'Tasks' },
  { id: 'timeline',     label: 'Timeline' },
  { id: 'packing',      label: 'Packing' },
  { id: 'bridesmaids',  label: 'Bridesmaids' },
  { id: 'vendors',      label: 'Vendors' },
]

/** @param {{ active: string, onChange: (id: string) => void }} props */
export function Nav({ active, onChange }) {
  return (
    <nav className="sticky top-0 z-10 bg-stone-50 border-b border-stone-200">
      <div className="max-w-2xl mx-auto px-4 flex gap-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              active === tab.id
                ? 'border-taupe-600 text-taupe-600'
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
