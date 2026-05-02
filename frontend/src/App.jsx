import { useState } from 'react'
import { useTasks } from './hooks/useTasks.js'
import { useWeddingDate } from './hooks/useWeddingDate.js'
import { useDeleteUndo } from './hooks/useDeleteUndo.js'
import { useDarkMode } from './hooks/useDarkMode.js'
import { Nav } from './components/Nav.jsx'
import { CountdownHeader } from './components/CountdownHeader.jsx'
import { ProgressBar } from './components/ProgressBar.jsx'
import { TaskList } from './components/TaskList.jsx'
import { AddTaskForm } from './components/AddTaskForm.jsx'
import { UndoToast } from './components/UndoToast.jsx'
import { TimelinePage } from './pages/TimelinePage.jsx'
import { PackingPage } from './pages/PackingPage.jsx'
import { VendorsPage } from './pages/VendorsPage.jsx'
import { BridesmaidsPage } from './pages/BridesmaidsPage.jsx'
import { SeatingPage } from './pages/SeatingPage.jsx'

export function App() {
  const [tab, setTab]             = useState('timeline')
  const [dayOfMode, setDayOfMode] = useState(() => localStorage.getItem('day-of-mode') === 'true')
  const { dark, toggle: toggleDark } = useDarkMode()

  const { tasks, loading, error, addTask, toggleTask, updateTask, deleteTask, reorderTasks } = useTasks()
  const { daysRemaining } = useWeddingDate()
  const { hiddenIds, pendingDelete, requestDelete, undoDelete } = useDeleteUndo(deleteTask)

  const visibleTasks   = tasks.filter(t => !hiddenIds.has(t.id))
  const completedCount = visibleTasks.filter(t => t.completed).length

  function handleDeleteTask(id) {
    const label = tasks.find(t => t.id === id)?.title ?? 'Task'
    requestDelete(id, label)
  }

  function toggleDayOf() {
    setDayOfMode(p => {
      const next = !p
      localStorage.setItem('day-of-mode', String(next))
      // If the active tab is hidden in day-of mode, jump to timeline
      if (next && tab !== 'timeline' && tab !== 'vendors') setTab('timeline')
      return next
    })
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 font-sans transition-colors">
      <CountdownHeader daysRemaining={daysRemaining} dayOfMode={dayOfMode} />

      <Nav
        active={tab}
        onChange={setTab}
        dark={dark}
        onToggleDark={toggleDark}
        dayOfMode={dayOfMode}
        onToggleDayOf={toggleDayOf}
      />

      {tab === 'tasks' && !dayOfMode && (
        <div className="max-w-2xl mx-auto">
          <div className="pt-6">
            <ProgressBar total={visibleTasks.length} completed={completedCount} />
          </div>

          {loading && <p className="text-center text-sm text-stone-400 py-8">Loading tasks…</p>}
          {error   && <p className="text-center text-sm text-red-400 py-8">Could not load tasks: {error}</p>}

          <AddTaskForm onAdd={addTask} />

          {!loading && !error && (
            <TaskList
              tasks={visibleTasks}
              onToggle={toggleTask}
              onUpdate={updateTask}
              onDelete={handleDeleteTask}
              onReorder={reorderTasks}
            />
          )}
          {pendingDelete && <UndoToast label={pendingDelete.label} onUndo={undoDelete} />}
        </div>
      )}

      {tab === 'timeline'    && <TimelinePage />}
      {tab === 'packing'     && !dayOfMode && <PackingPage />}
      {tab === 'bridesmaids' && !dayOfMode && <BridesmaidsPage />}
      {tab === 'vendors'     && <VendorsPage />}
      {tab === 'seating'     && <SeatingPage />}
    </div>
  )
}
