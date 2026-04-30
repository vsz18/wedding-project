import { useState, useEffect, useCallback } from 'react'

const BASE = import.meta.env.VITE_API_URL || ''
const API = `${BASE}/api/v1/vendors`

export function useVendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchVendors = useCallback(async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to fetch vendors')
      setVendors(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchVendors() }, [fetchVendors])

  const addVendor = useCallback(async (data) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to add vendor')
    const created = await res.json()
    setVendors(prev => [...prev, created])
    return created
  }, [])

  const updateVendor = useCallback(async (id, data) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update vendor')
    const saved = await res.json()
    setVendors(prev => prev.map(v => v.id === saved.id ? saved : v))
  }, [])

  const deleteVendor = useCallback(async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete vendor')
    setVendors(prev => prev.filter(v => v.id !== id))
  }, [])

  return { vendors, loading, error, addVendor, updateVendor, deleteVendor }
}
