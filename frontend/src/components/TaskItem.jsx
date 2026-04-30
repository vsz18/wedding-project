import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CATEGORIES = [
  'general','venue','catering','logistics',
  'entertainment','attire','finance','personal','events',
]

/** @param {{ task: object, onToggle: Function, onUpdate: Function, onDelete: Function }} */
export function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft]     = useState(task.title)
  const [expanded, setExpanded]         = useState(false)
  const [categoryDraft, setCategoryDraft] = useState(task.category || 'general')
  const [dueDayDraft, setDueDayDraft]   = useState(task.due_day ?? '')

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  function handleTitleBlur() {
    setEditingTitle(false)
    const trimmed = titleDraft.trim()
    if (trimmed && trimmed !== task.title) onUpdate(task, { title: trimmed })
    else setTitleDraft(task.title)
  }

  function handleMetaSave() {
    onUpdate(task, {
      category: categoryDraft,
      due_day: dueDayDraft !== '' ? Number(dueDayDraft) : null,
    })
    setExpanded(false)
  }

  return (
    <li ref={setNodeRef} style={style} className="group px-4 py-2.5 bg-transparent">
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none text-stone-300 dark:text-stone-600 hover:text-stone-400 dark:hover:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="5" cy="4" r="1.2"/><circle cx="11" cy="4" r="1.2"/>
            <circle cx="5" cy="8" r="1.2"/><circle cx="11" cy="8" r="1.2"/>
            <circle cx="5" cy="12" r="1.2"/><circle cx="11" cy="12" r="1.2"/>
          </svg>
        </button>

        {/* Checkbox */}
        <button
          onClick={() => onToggle(task)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.completed ? 'bg-taupe-600 border-taupe-600' : 'border-stone-300 dark:border-stone-600 hover:border-taupe-600'
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
            </svg>
          )}
        </button>

        {/* Title */}
        {editingTitle ? (
          <input
            value={titleDraft}
            onChange={e => setTitleDraft(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setTitleDraft(task.title); setEditingTitle(false) } }}
            autoFocus
            className="flex-1 text-sm border-b border-taupe-600 outline-none bg-transparent text-stone-700 dark:text-stone-200 py-0.5"
          />
        ) : (
          <span
            onClick={() => { setTitleDraft(task.title); setEditingTitle(true) }}
            className={`flex-1 text-sm cursor-text select-none ${task.completed ? 'line-through text-stone-400 dark:text-stone-600' : 'text-stone-700 dark:text-stone-200'}`}
          >
            {task.title}
          </span>
        )}

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {task.due_day != null && !expanded && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-taupe-50 dark:bg-taupe-600/20 text-taupe-600 font-medium">
              Day {task.due_day}
            </span>
          )}

          <button
            onClick={() => { setExpanded(p => !p); setCategoryDraft(task.category || 'general'); setDueDayDraft(task.due_day ?? '') }}
            aria-label="Edit details"
            className={`opacity-0 group-hover:opacity-100 transition-all ${expanded ? 'opacity-100 text-taupe-600' : 'text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 1.5l3 3-7 7H2.5v-3l7-7z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="opacity-0 group-hover:opacity-100 text-stone-300 dark:text-stone-600 hover:text-red-400 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8 8M11 3l-8 8" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 ml-10 flex items-center gap-2 flex-wrap">
          <select
            value={categoryDraft}
            onChange={e => setCategoryDraft(e.target.value)}
            className="text-xs bg-stone-100 dark:bg-stone-700 dark:text-stone-300 border-none rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-taupe-600"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          <input
            type="number" min={1} max={30}
            placeholder="Due day"
            value={dueDayDraft}
            onChange={e => setDueDayDraft(e.target.value)}
            className="w-24 text-xs bg-stone-100 dark:bg-stone-700 dark:text-stone-300 border-none rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-taupe-600"
          />

          <button onClick={handleMetaSave} className="text-xs bg-taupe-600 text-white px-3 py-1.5 rounded-md hover:bg-taupe-700 transition-colors">
            Save
          </button>
          <button onClick={() => setExpanded(false)} className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 px-2 py-1.5">
            Cancel
          </button>
        </div>
      )}
    </li>
  )
}
