import { useState, useRef, useEffect } from 'react'

/**
 * Optimistic delete with a 5-second undo window.
 * commitDelete(id) — the actual API delete call (from a hook).
 *
 * Returns:
 *   hiddenIds    — Set of ids removed from view but not yet committed
 *   pendingDelete — { id, label } | null  — drives the toast
 *   requestDelete(id, label) — hides item, starts timer
 *   undoDelete()  — cancels timer, restores item
 */
export function useDeleteUndo(commitDelete) {
  const [pendingDelete, setPendingDelete] = useState(null)
  const [hiddenIds, setHiddenIds]         = useState(new Set())
  const timerRef   = useRef(null)
  const pendingRef = useRef(null)
  const commitRef  = useRef(commitDelete)
  useEffect(() => { commitRef.current = commitDelete }, [commitDelete])

  function requestDelete(id, label) {
    // Flush any in-flight deletion immediately before starting a new one
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      if (pendingRef.current) commitRef.current(pendingRef.current.id)
    }
    setHiddenIds(prev => new Set([...prev, id]))
    const entry = { id, label }
    setPendingDelete(entry)
    pendingRef.current = entry
    timerRef.current = setTimeout(() => {
      commitRef.current(id)
      setHiddenIds(prev => { const s = new Set(prev); s.delete(id); return s })
      setPendingDelete(null)
      pendingRef.current = null
      timerRef.current   = null
    }, 5000)
  }

  function undoDelete() {
    if (!pendingRef.current) return
    clearTimeout(timerRef.current)
    timerRef.current = null
    setHiddenIds(prev => { const s = new Set(prev); s.delete(pendingRef.current.id); return s })
    setPendingDelete(null)
    pendingRef.current = null
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { hiddenIds, pendingDelete, requestDelete, undoDelete }
}
