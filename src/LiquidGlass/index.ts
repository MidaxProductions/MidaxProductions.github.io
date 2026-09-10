import { LiquidGlass } from '@ybouane/liquidglass'
import { GetGlassConfigFor } from './GlassConfig'
import { NeedsPseudoGlass } from '../Device'
import {
  ClearGlassPanelState,
  FindGlassPanels,
  MarkGlassPanel,
  RemoveStrayGlassCanvas,
} from './GlassPanels'

export interface LiquidGlassHandle {
  destroy(): void
  markChanged(element?: HTMLElement): void
}

const NullGlassHandle: LiquidGlassHandle = {
  destroy() {},
  markChanged() {},
}

// a new init waits for the previous one to release the DOM (StrictMode remounts)
let previousInit: Promise<LiquidGlassHandle> | null = null

// Safari and Firefox: the library liquid-glass shader is replaced by pseudo-liquid-glass CSS.
// Safari: html-to-image rasterisation (SVG foreignObject) takes seconds there and the WebGL
// pipeline renders black panels; Firefox: shader pipeline is skipped in favour of the CSS
// pseudo-glass treatment. The CSS backdrop-filter fallback is native and fast, so the shader
// glass is skipped entirely.
export function InitLiquidGlass(): Promise<LiquidGlassHandle> {
  if (NeedsPseudoGlass()) {
    previousInit = Promise.resolve(NullGlassHandle)
    return previousInit
  }
  const prior = previousInit
  const run = InitGlassInstance(prior)
  previousInit = run
  return run
}

async function InitGlassInstance(prior: Promise<LiquidGlassHandle> | null): Promise<LiquidGlassHandle> {
  if (prior) await prior.then((handle) => handle.destroy(), () => {})

  const root = document.getElementById('root')
  const panels = FindGlassPanels(root)
  if (!root || panels.length === 0) return NullGlassHandle

  for (const element of panels) MarkGlassPanel(element, GetGlassConfigFor(element))

  let instance: LiquidGlass | null = null
  try {
    instance = await LiquidGlass.init({ root, glassElements: panels })
    RestoreTextSelection(root)
  } catch (error) {
    for (const element of panels) {
      ClearGlassPanelState(element)
      RemoveStrayGlassCanvas(element)
    }
    console.warn('LiquidGlass: init failed, falling back to CSS glass:', error)
  }

  let destroyed = false
  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      instance?.destroy()
      for (const element of panels) ClearGlassPanelState(element)
    },
    markChanged(element) {
      instance?.markChanged(element)
    },
  }
}

// the library disables selection for its drag feature, we don't use floating - give it back
function RestoreTextSelection(root: HTMLElement) {
  root.style.userSelect = 'text'
  ;(root.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = 'text'
}