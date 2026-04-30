import { useWeather } from '../hooks/useWeather.js'

const ICONS = {
  sun:    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />,
  partly: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 2a5 5 0 014.95 4.3A4 4 0 1116 18H7a5 5 0 01-1-9.9" /></>,
  cloud:  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />,
  rain:   <><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 19l1 2m4-2l1 2m-6-5l1 2m4-2l1 2" /></>,
  storm:  <><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 10l-3 5h4l-3 5" /></>,
  snow:   <><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 19v2m4-2v2m-4-5l2-2m2 2l-2-2" /></>,
}

function WeatherIcon({ type }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      {ICONS[type] ?? ICONS.partly}
    </svg>
  )
}

export function WeatherWidget() {
  const { weather, status } = useWeather()

  if (status === 'loading' || !weather) return null

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-3">
      <WeatherIcon type={weather.icon} />
      <span className="font-medium text-stone-700 dark:text-stone-300">NYC · May 30</span>
      <span>{weather.hi}° / {weather.lo}°F</span>
      <span className="text-stone-300 dark:text-stone-600">·</span>
      <span>{weather.label}</span>
      <span className="text-stone-300 dark:text-stone-600">·</span>
      <span>{weather.rain}% rain</span>
      {status === 'historical' && (
        <span className="text-stone-400 dark:text-stone-500 italic">(avg)</span>
      )}
    </div>
  )
}
