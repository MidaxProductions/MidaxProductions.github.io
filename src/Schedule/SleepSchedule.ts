import { GetMoscowNow } from './MoscowTime'

// sleep window, Moscow time (GMT+3)
const SleepStartHour = 2 // 02:00 Moscow
const SleepEndHour   = 15 // 15:00 Moscow

export interface ResponseTimeStatus {
  num: string
  label: string
}

function IsSleepingNowMoscow(): boolean {
  const { hour } = GetMoscowNow()
  if (SleepStartHour > SleepEndHour) {
    return hour >= SleepStartHour || hour < SleepEndHour
  }
  return hour >= SleepStartHour && hour < SleepEndHour
}

function HoursUntilWake(): number {
  const { hour, minute } = GetMoscowNow()
  const nowFraction = hour + minute / 60
  let diff = SleepEndHour - nowFraction
  if (diff <= 0) diff += 24
  return diff
}

export function GetResponseTime(): ResponseTimeStatus {
  if (IsSleepingNowMoscow()) {
    const hrs = Math.max(1, Math.round(HoursUntilWake()))
    return { num: 'Offline', label: 'Back in ~' + hrs + (hrs === 1 ? ' hour' : ' hours') }
  }
  return { num: '<1hr', label: 'Usual response time' }
}