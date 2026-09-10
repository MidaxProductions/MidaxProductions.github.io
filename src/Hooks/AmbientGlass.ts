import { useEffect, type RefObject } from 'react'
import { InitBackground } from '../Background'
import { InitLiquidGlass } from '../LiquidGlass'
import type { LiquidGlassHandle } from '../LiquidGlass'

// one glass instance over the portaled panels, the ambience canvas feeds markChanged
export function useAmbientGlass(bgCanvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return
    let disposed = false
    let glass: LiquidGlassHandle | null = null

    const bg = InitBackground(canvas)
    bg.onChange = () => { glass?.markChanged(canvas) }

    // glass init is heavy, run it off the first-paint path
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    const startGlass = () => {
      if (disposed) return
      InitLiquidGlass().then(
        (handle) => {
          if (disposed) handle.destroy()
          else glass = handle
        },
        (err) => console.warn('LiquidGlass init failed:', err),
      )
    }
    const idleId = w.requestIdleCallback
      ? w.requestIdleCallback(startGlass, { timeout: 2000 })
      : window.setTimeout(startGlass, 300)

    return () => {
      disposed = true
      if (w.cancelIdleCallback) w.cancelIdleCallback(idleId)
      else clearTimeout(idleId)
      bg.destroy()
      glass?.destroy()
      glass = null
    }
  }, [bgCanvasRef])
}