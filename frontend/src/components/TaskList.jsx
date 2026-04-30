import { TaskGroup } from './TaskGroup.jsx'

/** @param {{ tasks: object[], onToggle: Function, onUpdate: Function, onDelete: Function, onReorder: Function }} props */
export function TaskList({ tasks, onToggle, onUpdate, onDelete, onReorder }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">
        No tasks yet — add one below.
      </div>
    )
  }

  const groups = tasks.reduce((acc, task) => {
    const key = task.category || 'general'
    if (!acc[key]) acc[key] = []
    acc[key].push(task)
    return acc
  }, {})

  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      {Object.entries(groups).map(([category, groupTasks]) => (
        <TaskGroup
          key={category}
          category={category}
          tasks={groupTasks}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReorder={onReorder}
        />
      ))}
    </div>
  )
}
