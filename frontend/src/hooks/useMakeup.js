import { useState, useEffect, useCallback } from 'react'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API = `${BASE}/api/v1/makeup`

export function useMakeup() {
  const [slots, setSlots]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchSlots = useCallback(async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to fetch makeup schedule')
      setSlots(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  const addSlot = useCallback(async (data) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to add slot')
    const created = await res.json()
    setSlots(prev => [...prev, created].sort((a, b) => a.sort_order - b.sort_order || a.start_time.localeCompare(b.start_time)))
  }, [])

  const updateSlot = useCallback(async (id, data) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update slot')
    const saved = await res.json()
    setSlots(prev => prev.map(s => s.id === saved.id ? saved : s))
  }, [])

  const deleteSlot = useCallback(async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete slot')
    setSlots(prev => prev.filter(s => s.id !== id))
  }, [])

  return { slots, loading, error, addSlot, updateSlot, deleteSlot }
}
