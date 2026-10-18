import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks'

const INTERACTIVE = 'a, button, input, textarea, label, canvas, [role="tab"]'

// Trailing ring cursor for fine pointers; the native cursor stays visible.
const Cursor = () => {
  const ring = useRef()
  const dot = useRef()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    const pos = { x: -100, y: -100 }
    const lag = { x: -100, y: -100 }
    let raf

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      const hot = e.target.closest?.(INTERACTIVE)
      ring.current.classList.toggle('is-hot', !!hot)
      ring.current.classList.add('is-ready')
    }
    const onLeave = () => ring.current.classList.remove('is-ready')
    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.18
      lag.y += (pos.y - lag.y) * 0.18
      ring.current.style.transform = `translate(${lag.x}px, ${lag.y}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ring} />
      <div className="cursor__dot" ref={dot} />
    </div>
  )
}

export default Cursor
