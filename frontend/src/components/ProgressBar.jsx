/** @param {{ total: number, completed: number }} props */
export function ProgressBar({ total, completed }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="px-4 pb-6 max-w-2xl mx-auto w-full">
      <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
        <span>{completed} of {total} tasks complete</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-taupe-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
