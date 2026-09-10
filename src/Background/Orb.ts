export interface OrbSpec {
  /** rgb triplet of the orb color */
  rgb: string
  /** peak alpha of the color */
  alpha: number
  /** disc radius */
  radius: number
  /** vertical radius for elliptical orbs, defaults to radius */
  radiusY?: number
  centerX: (width: number) => number
  centerY: (width: number, height: number) => number
  /** drift cycle duration, ms */
  periodMs: number
  offsetX: number
  offsetY: number
  scale: number
  /** alternate-reverse starts from the far keyframe */
  reverse?: boolean
}

// eased 0..1 drift, CSS ease-in-out ≈ smoothstep
export function DriftPosition(spec: OrbSpec, time: number, reducedMotion: boolean): number {
  if (reducedMotion) return spec.reverse ? 1 : 0
  let cycle = (time / spec.periodMs) % 2
  if (cycle < 0) cycle += 2
  let position = cycle < 1 ? cycle : 2 - cycle
  if (spec.reverse) position = 1 - position
  return position * position * (3 - 2 * position)
}
