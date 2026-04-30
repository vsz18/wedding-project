import { useState, useEffect, useCallback } from 'react'

const BASE = import.meta.env.VITE_API_URL || ''
const API = `${BASE}/api/v1/packing`

export function usePacking() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to fetch packing list')
      setItems(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const togglePacked = useCallback(async (item) => {
    const res = await fetch(`${API}/${item.id}/packed`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packed: !item.packed }),
    })
    if (!res.ok) throw new Error('Failed to update item')
    const saved = await res.json()
    setItems(prev => prev.map(i => i.id === saved.id ? saved : i))
  }, [])

  const addItem = useCallback(async ({ title, person, section }) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, person, section }),
    })
    if (!res.ok) throw new Error('Failed to add item')
    const created = await res.json()
    setItems(prev => [...prev, created])
  }, [])

  const deleteItem = useCallback(async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete item')
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const renameItem = useCallback(async (item, title) => {
    const res = await fetch(`${API}/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, title }),
    })
    if (!res.ok) throw new Error('Failed to rename item')
    const saved = await res.json()
    setItems(prev => prev.map(i => i.id === saved.id ? saved : i))
  }, [])

  return { items, loading, error, togglePacked, addItem, deleteItem, renameItem }
}
