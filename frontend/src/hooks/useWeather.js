import { useState, useEffect } from 'react'

const LAT = 40.8116
const LON = -73.9527
const WEDDING_DATE = '2026-05-30'

// WMO code → { label, icon }
function interpret(code) {
  if (code === 0)                          return { label: 'Clear',         icon: 'sun' }
  if (code <= 2)                           return { label: 'Partly cloudy', icon: 'partly' }
  if (code === 3)                          return { label: 'Overcast',      icon: 'cloud' }
  if (code <= 48)                          return { label: 'Foggy',         icon: 'cloud' }
  if (code <= 67)                          return { label: 'Rainy',         icon: 'rain' }
  if (code <= 77)                          return { label: 'Snowy',         icon: 'snow' }
  if (code <= 82)                          return { label: 'Showers',       icon: 'rain' }
  return                                          { label: 'Thunderstorms', icon: 'storm' }
}

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [status, setStatus]   = useState('loading') // loading | forecast | historical | error

  useEffect(() => {
    async function load() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${LAT}&longitude=${LON}` +
          `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
          `&timezone=America/New_York&temperature_unit=fahrenheit` +
          `&start_date=${WEDDING_DATE}&end_date=${WEDDING_DATE}`
        const res  = await fetch(url)
        const data = await res.json()
        const daily = data?.daily

        if (daily?.time?.[0] === WEDDING_DATE) {
          setWeather({
            hi:    Math.round(daily.temperature_2m_max[0]),
            lo:    Math.round(daily.temperature_2m_min[0]),
            rain:  daily.precipitation_probability_max[0],
            ...interpret(daily.weathercode[0]),
          })
          setStatus('forecast')
        } else {
          // Beyond forecast window — show NYC late-May historical averages
          setWeather({ hi: 73, lo: 57, rain: 35, label: 'Partly cloudy', icon: 'partly' })
          setStatus('historical')
        }
      } catch {
        setWeather({ hi: 73, lo: 57, rain: 35, label: 'Partly cloudy', icon: 'partly' })
        setStatus('historical')
      }
    }
    load()
  }, [])

  return { weather, status }
}
