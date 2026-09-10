export interface MoscowTime {
  hour: number
  minute: number
}

export function GetMoscowNow(): MoscowTime {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Moscow'
  }).formatToParts(new Date())
  const hour = Number(parts.find(p => p.type === 'hour')!.value)
  const minute = Number(parts.find(p => p.type === 'minute')!.value)
  return { hour, minute }
}

export function FormatMoscowClock({ hour, minute }: MoscowTime): string {
  return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0')
}