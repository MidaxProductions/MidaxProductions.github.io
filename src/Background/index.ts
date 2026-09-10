import { IsMobile } from '../Device'
import { ResolveAmbienceConfig } from './AmbienceConfig'
import { BackgroundAnimator } from './BackgroundAnimator'
import { BackgroundRenderer } from './BackgroundRenderer'

export interface BackgroundHandle {
  // called after every paint and scroll, wire to markChanged
  onChange: (() => void) | null
  destroy(): void
}

// page ambience in one fixed canvas - glass samples its live pixels
export function InitBackground(canvas: HTMLCanvasElement): BackgroundHandle {
  const context = canvas.getContext('2d')
  if (!context) return { onChange: null, destroy() {} }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const config = ResolveAmbienceConfig(IsMobile())
  const renderer = new BackgroundRenderer(context, config, reducedMotion)
  const animator = new BackgroundAnimator({
    canvas,
    renderer,
    orbs: config.orbs,
    reducedMotion,
    measureRatesTop: (viewportHeight) => {
      const ratesSection = document.getElementById('rates')
      return ratesSection ? Math.max(1, ratesSection.offsetTop - viewportHeight * 0.6) : 1
    },
  })
  animator.start()

  return {
    get onChange() { return animator.onChange },
    set onChange(value) { animator.onChange = value },
    destroy() { animator.destroy() },
  }
}