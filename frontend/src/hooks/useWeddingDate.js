import { useState } from 'react'

const STORAGE_KEY = 'wedding_date'

function defaultDate() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

export function useWeddingDate() {
  const [weddingDate, setWeddingDateState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || defaultDate()
  )

  const setWeddingDate = (dateStr) => {
    localStorage.setItem(STORAGE_KEY, dateStr)
    setWeddingDateState(dateStr)
  }

  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(weddingDate) - new Date().setHours(0, 0, 0, 0)) / 86400000)
  )

  return { weddingDate, setWeddingDate, daysRemaining }
}
