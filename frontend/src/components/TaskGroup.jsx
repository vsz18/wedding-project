import { TaskItem } from './TaskItem.jsx'

const CATEGORY_LABELS = {
  venue:         'Venue',
  catering:      'Catering',
  logistics:     'Logistics',
  entertainment: 'Entertainment',
  attire:        'Attire',
  finance:       'Finance & Payments',
  personal:      'Personal',
  events:        'Events',
  general:       'General',
}

/** @param {{ category: string, tasks: object[], onToggle: Function, onUpdate: Function, onDelete: Function }} props */
export function TaskGroup({ category, tasks, onToggle, onUpdate, onDelete }) {
  const completed = tasks.filter(t => t.completed).length

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-4 pb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          {CATEGORY_LABELS[category] ?? category}
        </span>
        <span className="text-xs text-stone-300">
          {completed}/{tasks.length}
        </span>
      </div>
      <ul className="divide-y divide-stone-100">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  )
}
