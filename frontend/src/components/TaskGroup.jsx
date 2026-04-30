import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
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

/** @param {{ category: string, tasks: object[], onToggle: Function, onUpdate: Function, onDelete: Function, onReorder: Function }} props */
export function TaskGroup({ category, tasks, onToggle, onUpdate, onDelete, onReorder }) {
  const [items, setItems] = useState(tasks)
  const completed = items.filter(t => t.completed).length

  // Sync if parent tasks change (new task added, toggle, etc.)
  if (tasks.length !== items.length ||
      tasks.some((t, i) => t.id !== items[i]?.id || t.completed !== items[i]?.completed || t.title !== items[i]?.title)) {
    setItems(tasks)
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const oldIdx = items.findIndex(t => t.id === active.id)
    const newIdx = items.findIndex(t => t.id === over.id)
    const reordered = arrayMove(items, oldIdx, newIdx)
    setItems(reordered)
    onReorder(reordered.map(t => t.id))
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-4 pb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
          {CATEGORY_LABELS[category] ?? category}
        </span>
        <span className="text-xs text-stone-300 dark:text-stone-600">
          {completed}/{items.length}
        </span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <ul className="divide-y divide-stone-100 dark:divide-stone-700/50">
            {items.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}
