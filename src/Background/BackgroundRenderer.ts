import type { AmbienceConfig } from './AmbienceConfig'
import { GridLayer } from './GridLayer'
import { DriftPosition } from './Orb'
import type { OrbSpec } from './Orb'

export interface FrameState {
  time: number
  width: number
  height: number
  /** 0..1 scroll dimming of the colored orbs */
  dusk: number
}

// scroll veil covers the header orb area, center matches the first orb in AmbienceConfig
const DuskVeilEllipse = { centerX: 0.15, centerY: -0.1, radiusX: 1050, radiusY: 600, hold: 0.5, fade: 0.7 }

// each gradient is baked into an offscreen sprite once, then blitted with drawImage;
// refilling giant radial gradients every frame is the slow path in Firefox/Safari.
// sprites are half CSS resolution: the gradients are soft, upscaling is invisible.
const SpriteScale = 0.5

export class BackgroundRenderer {
  private readonly context: CanvasRenderingContext2D
  private readonly config: AmbienceConfig
  private readonly reducedMotion: boolean
  private grid: GridLayer | null = null
  private devicePixelRatio = 1
  // base gradient is rebuilt only when the canvas height changes
  private baseGradientHeight = -1
  private baseGradient: CanvasGradient | null = null
  private readonly orbSprites: Array<HTMLCanvasElement | null>
  private veilSprite: HTMLCanvasElement | null = null

  constructor(context: CanvasRenderingContext2D, config: AmbienceConfig, reducedMotion: boolean) {
    this.context = context
    this.config = config
    this.reducedMotion = reducedMotion
    this.orbSprites = config.orbs.map(() => null)
  }

  resize(width: number, height: number, devicePixelRatio: number) {
    this.devicePixelRatio = devicePixelRatio
    this.grid = new GridLayer(width, height, devicePixelRatio, this.config.gridLineAlpha, this.config.gridCellSize)
  }

  paint(state: FrameState) {
    const { time, width, height, dusk } = state
    const { context, config } = this
    context.setTransform(this.devicePixelRatio, 0, 0, this.devicePixelRatio, 0, 0)

    if (!this.baseGradient || this.baseGradientHeight !== height) {
      const gradient = context.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, config.bgColorTop)
      gradient.addColorStop(1, config.bgColorBottom)
      this.baseGradient = gradient
      this.baseGradientHeight = height
    }
    context.fillStyle = this.baseGradient
    context.fillRect(0, 0, width, height)

    if (this.grid) context.drawImage(this.grid.canvas, 0, 0, width, height)

    const orbAlpha = (1 - dusk) * config.orbElementOpacity
    if (orbAlpha > 0.004) {
      context.globalAlpha = orbAlpha
      for (let i = 0; i < config.orbs.length; i++) {
        this.blitOrb(config.orbs[i], this.orbSprite(i), time, width, height)
      }
      context.globalAlpha = 1
    }

    if (dusk > 0.004) {
      const { centerX, centerY, radiusX, radiusY } = DuskVeilEllipse
      context.globalAlpha = dusk
      context.drawImage(
        this.veil,
        width * centerX - radiusX, height * centerY - radiusY, radiusX * 2, radiusY * 2,
      )
      context.globalAlpha = 1
    }
  }

  private blitOrb(spec: OrbSpec, sprite: HTMLCanvasElement, time: number, width: number, height: number) {
    const drift = DriftPosition(spec, time, this.reducedMotion)
    const spread = this.config.orbBlurSigma * 2
    const radiusX = (spec.radius + spread) * (1 + spec.scale * drift)
    const radiusY = ((spec.radiusY ?? spec.radius) + spread) * (1 + spec.scale * drift)
    this.context.drawImage(
      sprite,
      spec.centerX(width) + spec.offsetX * drift - radiusX,
      spec.centerY(width, height) + spec.offsetY * drift - radiusY,
      radiusX * 2, radiusY * 2,
    )
  }

  // baked lazily on the first paint, never rebuilt: dusk alpha is applied via globalAlpha
  private orbSprite(index: number): HTMLCanvasElement {
    let sprite = this.orbSprites[index]
    if (sprite) return sprite
    const spec = this.config.orbs[index]
    const spread = this.config.orbBlurSigma * 2
    const radiusX = spec.radius + spread
    const radiusY = (spec.radiusY ?? spec.radius) + spread
    sprite = document.createElement('canvas')
    sprite.width = Math.max(1, Math.round(radiusX * 2 * SpriteScale))
    sprite.height = Math.max(1, Math.round(radiusY * 2 * SpriteScale))
    const spriteContext = sprite.getContext('2d')!
    spriteContext.scale(SpriteScale, SpriteScale)
    spriteContext.translate(radiusX, radiusY)
    spriteContext.scale(radiusX, radiusY)
    const gradient = spriteContext.createRadialGradient(0, 0, 0, 0, 0, 1)
    for (const [offset, profileAlpha] of this.config.orbAlphaProfile) {
      gradient.addColorStop(offset, `rgba(${spec.rgb},${(profileAlpha * spec.alpha).toFixed(4)})`)
    }
    spriteContext.fillStyle = gradient
    spriteContext.fillRect(-1, -1, 2, 2)
    this.orbSprites[index] = sprite
    return sprite
  }

  private get veil(): HTMLCanvasElement {
    if (this.veilSprite) return this.veilSprite
    const { radiusX, radiusY, hold, fade } = DuskVeilEllipse
    const sprite = document.createElement('canvas')
    sprite.width = Math.max(1, Math.round(radiusX * 2 * SpriteScale))
    sprite.height = Math.max(1, Math.round(radiusY * 2 * SpriteScale))
    const spriteContext = sprite.getContext('2d')!
    spriteContext.scale(SpriteScale, SpriteScale)
    spriteContext.translate(radiusX, radiusY)
    spriteContext.scale(radiusX, radiusY)
    const gradient = spriteContext.createRadialGradient(0, 0, 0, 0, 0, 1)
    gradient.addColorStop(0, this.config.bgColorTop)
    gradient.addColorStop(hold, this.config.bgColorTop)
    gradient.addColorStop(fade, 'rgba(13,17,23,0)') // transparent bgColorTop
    spriteContext.fillStyle = gradient
    spriteContext.fillRect(-1, -1, 2, 2)
    this.veilSprite = sprite
    return sprite
  }
}