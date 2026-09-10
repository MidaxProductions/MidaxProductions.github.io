// cached grid layer: rebuilt only on resize, blitted every paint
export class GridLayer {
  readonly canvas: HTMLCanvasElement

  constructor(width: number, height: number, devicePixelRatio: number, lineAlpha: number, cellSize: number) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = Math.max(1, Math.round(width * devicePixelRatio))
    this.canvas.height = Math.max(1, Math.round(height * devicePixelRatio))
    const gridContext = this.canvas.getContext('2d')!
    gridContext.scale(devicePixelRatio, devicePixelRatio)
    gridContext.fillStyle = `rgba(255,255,255,${lineAlpha})`
    for (let x = 0; x <= width; x += cellSize) gridContext.fillRect(x, 0, 1, height)
    for (let y = 0; y <= height; y += cellSize) gridContext.fillRect(0, y, width, 1)

    // radial mask: opaque core, faded out by 90%
    gridContext.globalCompositeOperation = 'destination-in'
    gridContext.translate(width / 2, 0)
    gridContext.scale(width * 0.8, height * 0.6)
    const mask = gridContext.createRadialGradient(0, 0, 0, 0, 0, 1)
    mask.addColorStop(0, 'rgba(255,255,255,1)')
    mask.addColorStop(0.4, 'rgba(255,255,255,1)')
    mask.addColorStop(0.9, 'rgba(255,255,255,0)')
    mask.addColorStop(1, 'rgba(255,255,255,0)')
    gridContext.fillStyle = mask
    gridContext.fillRect(-1, -1, 2, 2)
  }
}
