import { useState } from 'react'

export function useTimelineAuth() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('timeline-unlocked') === 'true'
  )
  const [error, setError] = useState(false)

  function unlock(pin) {
    const correct = import.meta.env.VITE_TIMELINE_PIN || '1234'
    if (pin === correct) {
      sessionStorage.setItem('timeline-unlocked', 'true')
      setUnlocked(true)
      setError(false)
      return true
    }
    setError(true)
    return false
  }

  function lock() {
    sessionStorage.removeItem('timeline-unlocked')
    setUnlocked(false)
    setError(false)
  }

  return { unlocked, unlock, lock, error, clearError: () => setError(false) }
}
