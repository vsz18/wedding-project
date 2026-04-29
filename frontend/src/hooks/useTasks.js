import { useState, useEffect, useCallback } from 'react'

const API = 'http://localhost:3000/api/v1/tasks'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      setTasks(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const addTask = useCallback(async ({ title, category, due_day, notes }) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, due_day, notes }),
    })
    if (!res.ok) throw new Error('Failed to create task')
    const created = await res.json()
    setTasks(prev => [...prev, created].sort((a, b) => (a.due_day ?? 99) - (b.due_day ?? 99)))
  }, [])

  const toggleTask = useCallback(async (task) => {
    const updated = { ...task, completed: !task.completed }
    const res = await fetch(`${API}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    if (!res.ok) throw new Error('Failed to update task')
    const saved = await res.json()
    setTasks(prev => prev.map(t => t.id === saved.id ? saved : t))
  }, [])

  const updateTask = useCallback(async (task, changes) => {
    const updated = { ...task, ...changes }
    const res = await fetch(`${API}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    if (!res.ok) throw new Error('Failed to update task')
    const saved = await res.json()
    setTasks(prev =>
      prev
        .map(t => t.id === saved.id ? saved : t)
        .sort((a, b) => (a.due_day ?? 99) - (b.due_day ?? 99))
    )
  }, [])

  const deleteTask = useCallback(async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete task')
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  return { tasks, loading, error, addTask, toggleTask, updateTask, deleteTask }
}
