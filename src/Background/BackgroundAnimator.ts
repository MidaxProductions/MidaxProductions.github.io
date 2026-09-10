import type { BackgroundRenderer, FrameState } from './BackgroundRenderer'
import { DriftPosition } from './Orb'
import type { OrbSpec } from './Orb'

export interface BackgroundAnimatorDeps {
  canvas: HTMLCanvasElement
  renderer: BackgroundRenderer
  orbs: OrbSpec[]
  reducedMotion: boolean
  measureRatesTop: (viewportHeight: number) => number
}

// scene is soft gradients, beyond this DPR the extra pixels are invisible
const MaxPixelRatio = 1.5
// scroll dimming quantisation, ~1/255 of the veil alpha - one 8-bit step
const DuskEpsilon = 0.005
// idle drift quantisation: ~4px offset steps, invisible under soft orb gradients
const DriftEpsilon = 0.1

// owns WHEN the scene repaints: resize + scroll input, rAF loop, dirty flags
export class BackgroundAnimator {
  // called after every paint and scroll, wire to markChanged
  onChange: (() => void) | null = null

  private readonly canvas: HTMLCanvasElement
  private readonly renderer: BackgroundRenderer
  private readonly orbs: OrbSpec[]
  private readonly reducedMotion: boolean
  private readonly measureRatesTop: (viewportHeight: number) => number
  // orbs whose drift changes their render; static ones are skipped in the repaint check
  private readonly driftingOrbIndices: number[]

  private width = 0
  private height = 0
  private devicePixelRatio = 1
  private ratesTop = 1
  private dusk = 0
  private lastScrollY = -1
  private phases: number[] = []
  private needsPaint = true
  private needsMark = true
  private markToggle = false
  private rafId = 0

  constructor(deps: BackgroundAnimatorDeps) {
    this.canvas = deps.canvas
    this.renderer = deps.renderer
    this.orbs = deps.orbs
    this.reducedMotion = deps.reducedMotion
    this.measureRatesTop = deps.measureRatesTop
    this.driftingOrbIndices = deps.orbs
      .map((orb, index) => ({ orb, index }))
      .filter(({ orb }) => orb.scale !== 0 || orb.offsetX !== 0 || orb.offsetY !== 0)
      .map(({ index }) => index)
  }

  start() {
    window.addEventListener('resize', this.onResize)
    this.resize()
    this.lastScrollY = window.scrollY
    this.dusk = this.computeDusk(this.lastScrollY)
    // synchronous first frame - glass init sees a painted scene
    this.renderer.paint(this.frameState(performance.now()))
    this.rafId = requestAnimationFrame(this.frame)
    // webfonts land after mount and shift #rates, re-measure once they settle
    document.fonts.ready.then(() => this.refreshRatesTop())
  }

  destroy() {
    cancelAnimationFrame(this.rafId)
    window.removeEventListener('resize', this.onResize)
    this.onChange = null
  }

  private onResize = () => {
    this.resize()
  }

  private resize() {
    // canvas is overscanned 48px in CSS, measure it rather than the viewport
    this.width = this.canvas.clientWidth
    this.height = this.canvas.clientHeight
    this.devicePixelRatio = Math.min(window.devicePixelRatio || 1, MaxPixelRatio)
    this.canvas.width = Math.max(1, Math.round(this.width * this.devicePixelRatio))
    this.canvas.height = Math.max(1, Math.round(this.height * this.devicePixelRatio))
    this.renderer.resize(this.width, this.height, this.devicePixelRatio)
    this.refreshRatesTop()
    this.needsPaint = true
  }

  private refreshRatesTop() {
    this.ratesTop = this.measureRatesTop(this.height)
  }

  private computeDusk(scrollPosition: number): number {
    return Math.min(1, Math.max(0, scrollPosition / this.ratesTop))
  }

  private frameState(time: number): FrameState {
    return { time, width: this.width, height: this.height, dusk: this.dusk }
  }

  private frame = (time: number) => {
    this.rafId = requestAnimationFrame(this.frame)

    // ambience is viewport-anchored, but panels shift on scroll - always mark
    const scrollY = window.scrollY
    if (scrollY !== this.lastScrollY) {
      this.lastScrollY = scrollY
      const nextDusk = this.computeDusk(scrollY)
      if (Math.abs(nextDusk - this.dusk) > DuskEpsilon) {
        this.dusk = nextDusk
        this.needsPaint = true
      }
      this.needsMark = true
    }

    // idle orb drift quantised to ~4px steps: invisible under soft gradients, caps repaints
    if (this.dusk < 0.995 && !this.reducedMotion) {
      let drifted = false
      for (let i = 0; i < this.driftingOrbIndices.length; i++) {
        const phase = DriftPosition(this.orbs[this.driftingOrbIndices[i]], time, this.reducedMotion)
        if (Math.abs(phase - (this.phases[i] ?? phase)) > DriftEpsilon) drifted = true
        this.phases[i] = phase
      }
      if (drifted) this.needsPaint = true
    }

    if (this.needsPaint) {
      this.renderer.paint(this.frameState(time))
      this.needsPaint = false
      this.needsMark = true
    }
    if (this.needsMark) {
      this.needsMark = false
      // glass re-render is the expensive consumer; ~30Hz is plenty, the next frame
      // re-sets the mark while scrolling so nothing stays stale
      this.markToggle = !this.markToggle
      if (this.markToggle) this.onChange?.()
    }
  }
}
