import { useState, useEffect, useCallback } from 'react'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API = `${BASE}/api/v1/bridesmaids`

export function useBridesmaids() {
  const [tasks, setTasks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to fetch bridesmaids tasks')
      setTasks(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const addTask = useCallback(async (data) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to add task')
    const created = await res.json()
    setTasks(prev => [...prev, created])
  }, [])

  const toggleTask = useCallback(async (task) => {
    const res = await fetch(`${API}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    })
    if (!res.ok) throw new Error('Failed to update task')
    const saved = await res.json()
    setTasks(prev => prev.map(t => t.id === saved.id ? saved : t))
  }, [])

  const updateTask = useCallback(async (task, changes) => {
    const res = await fetch(`${API}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, ...changes }),
    })
    if (!res.ok) throw new Error('Failed to update task')
    const saved = await res.json()
    setTasks(prev => prev.map(t => t.id === saved.id ? saved : t))
  }, [])

  const deleteTask = useCallback(async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete task')
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  return { tasks, loading, error, addTask, toggleTask, updateTask, deleteTask }
}
