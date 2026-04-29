import { useState, useEffect, useCallback } from 'react'

const API = 'http://localhost:3000/api/v1/timeline'

function timeToMins(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function minsToTime(mins) {
  const h = Math.floor(mins / 60) % 24
  const m = mins % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

/** Calculates ripple status for each event.
 *  carryover: excess delay (mins) not absorbed by previous event's buffer */
function applyRipple(events) {
  let carryover = 0
  return events.map(ev => {
    const incomingDelay = carryover + (ev.delay_mins || 0)
    const scheduledStartMins = timeToMins(ev.start_time)
    const effectiveStartMins = scheduledStartMins + incomingDelay

    let status = 'on-time'
    if (incomingDelay > 0) {
      if (incomingDelay <= ev.buffer_mins) {
        status = 'buffered'
        carryover = 0
      } else {
        status = 'delayed'
        carryover = incomingDelay - ev.buffer_mins
      }
    } else {
      carryover = 0
    }

    return {
      ...ev,
      incomingDelay,
      effectiveStartMins,
      effectiveStartDisplay: minsToTime(effectiveStartMins),
      scheduledDisplay: minsToTime(scheduledStartMins),
      status,
    }
  })
}

export function useTimeline() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to fetch timeline')
      setEvents(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const setDelay = useCallback(async (id, delay_mins) => {
    const res = await fetch(`${API}/${id}/delay`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delay_mins }),
    })
    if (!res.ok) throw new Error('Failed to update delay')
    const saved = await res.json()
    setEvents(prev => prev.map(e => e.id === saved.id ? saved : e))
  }, [])

  const updateEvent = useCallback(async (id, data) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update event')
    const saved = await res.json()
    setEvents(prev => prev.map(e => e.id === saved.id ? saved : e))
  }, [])

  const addEvent = useCallback(async (data) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create event')
    const created = await res.json()
    setEvents(prev =>
      [...prev, created].sort((a, b) => {
        const tA = (a.start_time || '').slice(0, 5)
        const tB = (b.start_time || '').slice(0, 5)
        if (tA !== tB) return tA.localeCompare(tB)
        return (a.sort_order || 0) - (b.sort_order || 0)
      })
    )
  }, [])

  const deleteEvent = useCallback(async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete event')
    setEvents(prev => prev.filter(e => e.id !== id))
  }, [])

  const eventsWithRipple = applyRipple(events)

  return { events: eventsWithRipple, loading, error, setDelay, updateEvent, addEvent, deleteEvent }
}
