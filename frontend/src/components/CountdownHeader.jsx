import { WeatherWidget } from './WeatherWidget.jsx'

/** @param {{ daysRemaining: number, dayOfMode: boolean }} props */
export function CountdownHeader({ daysRemaining, dayOfMode }) {
  return (
    <div className={`text-center py-8 sm:py-10 px-4 transition-colors ${dayOfMode ? 'bg-taupe-50 dark:bg-stone-800' : ''}`}>
      {dayOfMode && (
        <div className="text-xs font-semibold uppercase tracking-widest text-taupe-600 mb-3">
          Day Of
        </div>
      )}
      <div className="font-serif text-6xl sm:text-8xl font-medium text-stone-800 dark:text-stone-100 leading-none tabular-nums">
        {daysRemaining}
      </div>
      <div className="mt-2 text-stone-500 dark:text-stone-400 text-sm uppercase tracking-widest font-medium">
        {daysRemaining === 1 ? 'day' : 'days'} until the Scott-Zhang wedding
      </div>
      <div className="mt-4 text-taupe-600 text-sm">
        May 30, 2026
      </div>
      <WeatherWidget />
    </div>
  )
}
