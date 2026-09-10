import { useEffect, useState } from 'react'
import { FormatMoscowClock, GetMoscowNow } from '../Schedule'

// Moscow wall clock for the header, updates every 15s
export function useMoscowClock(): string {
  const [moscowTime, setMoscowTime] = useState(() => FormatMoscowClock(GetMoscowNow()))

  useEffect(() => {
    function updateMoscowTime() {
      setMoscowTime(FormatMoscowClock(GetMoscowNow()))
    }
    updateMoscowTime()
    const interval = setInterval(updateMoscowTime, 15000)
    return () => clearInterval(interval)
  }, [])

  return moscowTime
}