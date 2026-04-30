import { useState } from 'react'
import { useTasks } from './hooks/useTasks.js'
import { useWeddingDate } from './hooks/useWeddingDate.js'
import { useDeleteUndo } from './hooks/useDeleteUndo.js'
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

export function App() {
  const [tab, setTab] = useState('tasks')
  const { tasks, loading, error, addTask, toggleTask, updateTask, deleteTask } = useTasks()
  const { weddingDate, setWeddingDate, daysRemaining } = useWeddingDate()
  const { hiddenIds, pendingDelete, requestDelete, undoDelete } = useDeleteUndo(deleteTask)

  const visibleTasks   = tasks.filter(t => !hiddenIds.has(t.id))
  const completedCount = visibleTasks.filter(t => t.completed).length

  function handleDeleteTask(id) {
    const label = tasks.find(t => t.id === id)?.title ?? 'Task'
    requestDelete(id, label)
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <CountdownHeader
        daysRemaining={daysRemaining}
        weddingDate={weddingDate}
        onDateChange={setWeddingDate}
      />

      <Nav active={tab} onChange={setTab} />

      {tab === 'tasks' && (
        <div className="max-w-2xl mx-auto">
          <div className="pt-6">
            <ProgressBar total={visibleTasks.length} completed={completedCount} />
          </div>

          {loading && <p className="text-center text-sm text-stone-400 py-8">Loading tasks…</p>}
          {error   && <p className="text-center text-sm text-red-400 py-8">Could not load tasks: {error}</p>}

          {!loading && !error && (
            <TaskList tasks={visibleTasks} onToggle={toggleTask} onUpdate={updateTask} onDelete={handleDeleteTask} />
          )}

          <AddTaskForm onAdd={addTask} />
          {pendingDelete && <UndoToast label={pendingDelete.label} onUndo={undoDelete} />}
        </div>
      )}

      {tab === 'timeline'    && <TimelinePage />}
      {tab === 'packing'     && <PackingPage />}
      {tab === 'bridesmaids' && <BridesmaidsPage />}
      {tab === 'vendors'     && <VendorsPage />}
    </div>
  )
}
