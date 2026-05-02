export const WEDDING_DATE = '2026-05-30'

export function useWeddingDate() {
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(WEDDING_DATE) - new Date().setHours(0, 0, 0, 0)) / 86400000)
  )

  return { weddingDate: WEDDING_DATE, daysRemaining }
}
