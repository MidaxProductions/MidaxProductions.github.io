export const DefaultGlassConfig = {
  blurAmount: 0.25,
  refraction: 2,
  chromAberration: 0.15,
  edgeHighlight: 0.25,
  specular: 0,
  fresnel: 0,
  cornerRadius: 16,
  zRadius: 7,
  opacity: 1,
  saturation: 0.3,
  brightness: 0.2,
  shadowOpacity: 0.3,
  shadowSpread: 10,
  button: false,
}

export type GlassElementOverrides = Partial<typeof DefaultGlassConfig>

// planned next: per-panel tint and a springy (elastic) press for button panels -
// both land as config keys here + overrides for the `button: true` elements, and as
// .pseudo-glass CSS rules on the iOS/Firefox/Safari fallback path; no other call sites need touching
const ElementGlassOverrides: Record<string, GlassElementOverrides> = {
  'github-button': { button: true },
  'discord-button': { button: true },
}

export function GetGlassConfigFor(element: HTMLElement): string {
  const cssRadius = parseFloat(getComputedStyle(element).borderTopLeftRadius)
  const cornerRadius = Number.isFinite(cssRadius) && cssRadius > 0
    ? cssRadius
    : DefaultGlassConfig.cornerRadius
  return JSON.stringify({
    ...DefaultGlassConfig,
    cornerRadius,
    ...ElementGlassOverrides[element.id],
  })
}
