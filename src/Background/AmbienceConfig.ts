import type { OrbSpec } from './Orb'

const AccentRgb = '255,176,32'

export interface AmbienceConfig {
  bgColorTop: string
  bgColorBottom: string
  accentRgb: string
  gridLineAlpha: number
  gridCellSize: number
  /** orb blur radius, the glow spreads ~2 past the disc */
  orbBlurSigma: number
  orbElementOpacity: number
  /** blurred-disc alpha profile, sampled at distance / (radius + 2) */
  orbAlphaProfile: Array<[number, number]>
  orbs: OrbSpec[]
}

export const DefaultAmbienceConfig: AmbienceConfig = {
  bgColorTop: '#0d1117',
  bgColorBottom: '#11161f',
  accentRgb: AccentRgb,
  gridLineAlpha: 0.05,
  gridCellSize: 56,
  orbBlurSigma: 200,
  orbElementOpacity: 0.5,
  orbAlphaProfile: [
    [0, 1], [0.35, 0.98], [0.5, 0.8], [0.6, 0.5], [0.7, 0.27], [0.8, 0.13], [0.9, 0.05], [1, 0],
  ],
  orbs: [
    {
      rgb: AccentRgb, alpha: 0.3, radius: 600, radiusY: 200,
      centerX: (width) => width * 0.15, centerY: (_width, height) => height * -0.1,
      periodMs: 22000, offsetX: 0, offsetY: 0, scale: 0,
    },
    {
      rgb: AccentRgb, alpha: 0.22, radius: 260,
      centerX: (width) => width - 140, centerY: () => 120,
      periodMs: 22000, offsetX: 40, offsetY: 50, scale: 0.08,
    },
    {
      rgb: '88,101,242', alpha: 0.18, radius: 230,
      centerX: () => 50, centerY: (_width, height) => height * 0.38 + 230,
      periodMs: 26000, offsetX: 40, offsetY: 50, scale: 0.08, reverse: true,
    },
    {
      rgb: '168,85,247', alpha: 0.16, radius: 210,
      centerX: (width) => width * 0.92 - 210, centerY: (_width, height) => height - 70,
      periodMs: 30000, offsetX: 40, offsetY: 50, scale: 0.08,
    },
  ],
}

// device-dependent config resolution lives next to the config it overrides
export function ResolveAmbienceConfig(isMobileDevice: boolean): AmbienceConfig {
  // orbs at 30% on every mobile device, desktop keeps the config's 50%
  return isMobileDevice ? { ...DefaultAmbienceConfig, orbElementOpacity: 0.3 } : DefaultAmbienceConfig
}
