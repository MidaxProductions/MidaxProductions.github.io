import { useRef, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useSlotSync } from './useSlotSync'

interface GlassPanelProps {
  // Element type of the portaled panel
  as?: 'div' | 'a'
  // content-sized panels own their width and mirror it to the slot
  intrinsic?: boolean
  id?: string
  className?: string
  style?: CSSProperties
  href?: string
  target?: string
  rel?: string
  children?: ReactNode
}

export function GlassPanel({
  as: Tag = 'div',
  intrinsic = false,
  id,
  className,
  style,
  href,
  target,
  rel,
  children,
}: GlassPanelProps) {
  const slotRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement | null>(null)
  const setPanelRef = (el: HTMLElement | null) => { panelRef.current = el }

  useSlotSync(slotRef, panelRef, intrinsic)

  const panelClass = className ? `${className} lg-panel` : 'lg-panel'
  const rootEl = document.getElementById('root')

  const panel = Tag === 'a' ? (
    <a ref={setPanelRef} id={id} className={panelClass} style={style} href={href} target={target} rel={rel}>
      {children}
    </a>
  ) : (
    <div ref={setPanelRef} id={id} className={panelClass} style={style}>
      {children}
    </div>
  )

  return (
    <>
      <div ref={slotRef} className="lg-slot" aria-hidden="true" />
      {rootEl ? createPortal(panel, rootEl) : panel}
    </>
  )
}