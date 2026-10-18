import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from './Nav'

const STEPS = [{ id: 'top', label: 'Intro' }, ...SECTIONS]
const pad = (n) => String(n).padStart(2, '0')

// Replaces the hidden native scrollbar: a progress rail with one dot per
// section and a "03 / 06" step counter.
const Progress = () => {
  const fill = useRef()
  const bar = useRef()
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf
    const update = () => {
      raf = null
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      fill.current.style.transform = `scaleY(${p})`
      bar.current.style.transform = `scaleX(${p})`

      const line = window.innerHeight * 0.45
      let idx = 0
      STEPS.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) idx = i
      })
      setActive(idx)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="progress-bar" aria-hidden="true">
        <span ref={bar} />
      </div>
      <nav className="steps" aria-label="Page progress">
        <div className="steps__track" aria-hidden="true">
          <span ref={fill} />
        </div>
        <ol>
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`${i === active ? 'is-active' : ''}${i < active ? ' is-done' : ''}`}
                aria-current={i === active ? 'step' : undefined}
              >
                <span className="steps__label">{s.label}</span>
                <span className="steps__dot" />
              </a>
            </li>
          ))}
        </ol>
        <p className="steps__count mono" aria-live="polite">
          <b>{pad(active)}</b>
          <span>/ {pad(STEPS.length - 1)}</span>
        </p>
      </nav>
    </>
  )
}

export default Progress
