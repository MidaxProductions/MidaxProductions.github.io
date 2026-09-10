// panels must be direct #root children (library requirement), GlassPanel portals arrange that
export const GlassPanelSelector = '#root > .lg-panel'

export const LiquidGlassClass = 'liquid-glass'

export function FindGlassPanels(root: HTMLElement | null): HTMLElement[] {
  return root ? Array.from(root.querySelectorAll<HTMLElement>(GlassPanelSelector)) : []
}

export function MarkGlassPanel(element: HTMLElement, configJson: string) {
  element.classList.add(LiquidGlassClass)
  element.dataset.config = configJson
}

export function ClearGlassPanelState(element: HTMLElement) {
  element.classList.remove(LiquidGlassClass)
  delete element.dataset.config
}

export function RemoveStrayGlassCanvas(element: HTMLElement) {
  element.querySelector(':scope > canvas')?.remove()
}
