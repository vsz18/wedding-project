import { useState, useRef, useEffect } from 'react'

const UNDO_MS = 10_000

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
    }, UNDO_MS)
  }

  function undoDelete() {
    if (!pendingRef.current) return
    // Capture id before nulling the ref — the setHiddenIds updater
    // may run after the ref is cleared, which would throw.
    const id = pendingRef.current.id
    clearTimeout(timerRef.current)
    timerRef.current = null
    pendingRef.current = null
    setPendingDelete(null)
    setHiddenIds(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { hiddenIds, pendingDelete, requestDelete, undoDelete }
}
