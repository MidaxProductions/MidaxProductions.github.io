import { useLayoutEffect, type RefObject } from 'react'

// panel is a direct #root child over the slot, the library only sees root's direct children
export function useSlotSync(
  slotRef: RefObject<HTMLDivElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  intrinsic: boolean,
) {
  useLayoutEffect(() => {
    const slot = slotRef.current
    const panel = panelRef.current
    if (!slot || !panel) return

    let frame = 0
    const sync = () => {
      frame = 0
      const rect = slot.getBoundingClientRect()
      panel.style.left = rect.left + window.scrollX + 'px'
      panel.style.top = rect.top + window.scrollY + 'px'
      if (intrinsic) {
        // content-sized panels own their width and mirror it to the slot
        const width = panel.offsetWidth
        if (Math.abs(slot.offsetWidth - width) > 0.5) slot.style.width = width + 'px'
      } else {
        panel.style.width = rect.width + 'px'
      }
      const height = panel.offsetHeight
      if (Math.abs(slot.offsetHeight - height) > 0.5) slot.style.height = height + 'px'
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync) }

    // sync before first paint so the panel doesn't flash at the end of #root
    sync()
    const slotObserver = new ResizeObserver(schedule)
    slotObserver.observe(slot)
    const panelObserver = new ResizeObserver(schedule)
    panelObserver.observe(panel)
    window.addEventListener('resize', sync)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', sync)
      slotObserver.disconnect()
      panelObserver.disconnect()
    }
  }, [slotRef, panelRef, intrinsic])
}