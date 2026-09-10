export function IsIOS(userAgent: string = navigator.userAgent): boolean {
  return /iPad|iPhone|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1)
}

// phones and tablets of any os
export function IsMobile(userAgent: string = navigator.userAgent): boolean {
  return IsIOS(userAgent) || /Android|Mobile|Tablet|Silk/i.test(userAgent)
}

// Safari and Firefox
export function NeedsPseudoGlass(userAgent: string = navigator.userAgent): boolean {
  if (IsIOS(userAgent)) return true
  if (/AppleWebKit\//.test(userAgent) && !/Chrom(e|ium)|Edg|OPR\//.test(userAgent)) return true
  if (/Firefox\//.test(userAgent)) return true
  return false
}