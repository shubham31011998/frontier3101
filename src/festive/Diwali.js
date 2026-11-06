import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { profile } from '../data/resume'
import { useReducedMotion } from '../hooks'
import '../styles/_diwali.scss'

const COLORS = ['#ffd166', '#ff9f1c', '#ff5d8f', '#ffe8a3', '#c77dff', '#4cc9f0', '#ff6b35']
const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

/* ---------------- Fireworks ---------------- */

// Full-screen canvas: rockets rise and burst. `fireRef.current(x?, y?)` launches one on demand.
const Fireworks = ({ fireRef, auto }) => {
  const canvas = useRef()

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0
    let H = 0
    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      cv.width = W * dpr
      cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const rockets = []
    const sparks = []

    const burst = (x, y) => {
      const color = pick(COLORS)
      const alt = pick(COLORS)
      const n = Math.round(rand(60, 95))
      const power = rand(3.2, 5.2)
      const ring = Math.random() < 0.35
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05)
        const s = ring ? power : power * Math.sqrt(Math.random())
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: rand(55, 85),
          age: 0,
          color: i % 3 === 0 ? alt : color,
          trail: [],
          glitter: Math.random() < 0.3,
        })
      }
    }

    const launch = (tx, ty) => {
      const x = tx ?? rand(W * 0.15, W * 0.85)
      const y = ty ?? rand(H * 0.12, H * 0.42)
      const sx = x + rand(-60, 60)
      rockets.push({ x: sx, y: H + 10, tx: x, ty: y, trail: [] })
    }
    fireRef.current = launch

    let raf
    let last = performance.now()
    let nextAuto = performance.now() + 400
    let introLeft = 6 // a little show when the page opens

    const frame = (now) => {
      const step = Math.min((now - last) / 16.67, 3)
      last = now

      if (auto && !document.hidden && now > nextAuto) {
        launch()
        if (introLeft > 0) {
          introLeft--
          nextAuto = now + rand(350, 750)
        } else {
          nextAuto = now + rand(7000, 12000)
        }
      }

      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.trail.push([r.x, r.y])
        if (r.trail.length > 8) r.trail.shift()
        const dy = r.ty - r.y
        r.y += Math.max(dy * 0.06, -14) * step
        r.x += (r.tx - r.x) * 0.06 * step
        ctx.strokeStyle = 'rgba(255, 214, 140, 0.8)'
        ctx.lineWidth = 2
        ctx.beginPath()
        r.trail.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        ctx.stroke()
        if (Math.abs(dy) < 6) {
          burst(r.x, r.y)
          rockets.splice(i, 1)
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]
        p.trail.push([p.x, p.y])
        if (p.trail.length > 5) p.trail.shift()
        p.vx *= 0.975 ** step
        p.vy = p.vy * 0.975 ** step + 0.05 * step
        p.x += p.vx * step
        p.y += p.vy * step
        p.age += step
        const t = 1 - p.age / p.life
        if (t <= 0) {
          sparks.splice(i, 1)
          continue
        }
        const twinkle = p.glitter ? (Math.random() < 0.5 ? 0.2 : 1) : 1
        ctx.globalAlpha = t * twinkle
        ctx.strokeStyle = p.color
        ctx.lineWidth = 2
        ctx.beginPath()
        p.trail.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      fireRef.current = () => {}
    }
  }, [fireRef, auto])

  return <canvas ref={canvas} className="diwali-fireworks" aria-hidden="true" />
}

/* ---------------- Garland (toran) ---------------- */

const SWAG = 140

// One scalloped swag of marigolds with mango leaves at the joint.
const Swag = ({ hang, index }) => {
  const flowers = useMemo(() => {
    const pts = []
    const n = 16
    for (let i = 0; i <= n; i++) {
      const t = i / n
      // quadratic curve (0,6) -> (SWAG,6), control (SWAG/2, 52)
      const x = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * (SWAG / 2) + t * t * SWAG
      const y = (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 52 + t * t * 6
      pts.push([x, y, i % 2 ? 'url(#dw-marigold-y)' : 'url(#dw-marigold-o)'])
    }
    return pts
  }, [])

  return (
    <div className="diwali-swag" style={{ width: SWAG }}>
      <svg width={SWAG} height="64" viewBox={`0 0 ${SWAG} 64`} aria-hidden="true">
        {flowers.map(([x, y, fill], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill={fill} />
            <circle cx={x} cy={y} r="1.6" fill="#b5480b" />
          </g>
        ))}
        <path d="M0 4 q-10 14 -2 26 q8 -12 2 -26z" fill="#2f9e44" />
        <path d="M0 4 q10 14 2 26 q-8 -12 -2 -26z" fill="#40c057" />
      </svg>
      {hang && (
        <div className="diwali-strand" style={{ animationDelay: `${-index * 0.7}s` }}>
          <span className="diwali-strand__string" />
          <svg width="22" height="30" viewBox="0 0 22 30" aria-hidden="true">
            <path d="M11 0 L20 10 Q20 22 11 28 Q2 22 2 10 Z" fill="url(#dw-marigold-o)" />
            <circle cx="11" cy="14" r="3" fill="#ffe066" />
          </svg>
        </div>
      )}
    </div>
  )
}

const Garland = () => {
  // Enough swags to cover the width even when scaled down on phones.
  const fit = () => Math.ceil(window.innerWidth / (SWAG * 0.75)) + 1
  const [count, setCount] = useState(fit)
  useEffect(() => {
    const onResize = () => setCount(fit())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return (
    <div className="diwali-garland" aria-hidden="true">
      <div className="diwali-garland__row">
        {Array.from({ length: count }, (_, i) => (
          <Swag key={i} index={i} hang={i % 2 === 1} />
        ))}
      </div>
    </div>
  )
}

/* ---------------- Diyas ---------------- */

const Diya = ({ delay = 0 }) => (
  <svg className="diwali-diya" viewBox="0 0 64 56" aria-hidden="true">
    <g className="diwali-diya__flame" style={{ animationDelay: `${delay}s` }}>
      <ellipse cx="32" cy="14" rx="14" ry="16" fill="url(#dw-glow)" />
      <path d="M32 2 C38 12 38 20 32 24 C26 20 26 12 32 2 Z" fill="url(#dw-flame)" />
    </g>
    <path d="M4 28 Q32 30 60 28 Q56 50 32 52 Q8 50 4 28 Z" fill="url(#dw-clay)" />
    <path d="M4 28 Q32 34 60 28" fill="none" stroke="#ffd166" strokeWidth="2" />
    <circle cx="20" cy="40" r="2" fill="#ffd166" />
    <circle cx="32" cy="43" r="2" fill="#ffd166" />
    <circle cx="44" cy="40" r="2" fill="#ffd166" />
  </svg>
)

/* ---------------- Gift ---------------- */

const Gift = ({ onOpen }) => {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState(false)

  const click = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    onOpen(r.left + r.width / 2, r.top)
    if (!open) {
      setOpen(true)
      setMsg(true)
    } else {
      setMsg((m) => !m)
    }
  }

  return (
    <div className="diwali-gift-wrap">
      {msg && (
        <div className="diwali-toast" role="status">
          <strong>Happy Diwali! 🪔</strong>
          <span>
            Wishing you light, joy and bug-free deploys. — {profile.firstName}
          </span>
        </div>
      )}
      <button
        type="button"
        className={`diwali-gift ${open ? 'is-open' : ''}`}
        onClick={click}
        aria-label={open ? 'Launch more fireworks' : 'Open your Diwali gift'}
      >
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g className="diwali-gift__lid">
            <path d="M32 14 C24 2 12 6 18 13 Z M32 14 C40 2 52 6 46 13 Z" fill="#ffd166" stroke="#e8a317" />
            <rect x="8" y="14" width="48" height="12" rx="2" fill="#e63946" />
            <rect x="28" y="14" width="8" height="12" fill="#ffd166" />
          </g>
          <rect x="11" y="26" width="42" height="32" rx="2" fill="#c1121f" />
          <rect x="28" y="26" width="8" height="32" fill="#ffd166" />
        </svg>
      </button>
    </div>
  )
}

/* ---------------- Theme ---------------- */

const Defs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <radialGradient id="dw-marigold-o">
        <stop offset="0" stopColor="#ffb703" />
        <stop offset="1" stopColor="#f77f00" />
      </radialGradient>
      <radialGradient id="dw-marigold-y">
        <stop offset="0" stopColor="#ffe066" />
        <stop offset="1" stopColor="#fcbf49" />
      </radialGradient>
      <radialGradient id="dw-glow">
        <stop offset="0" stopColor="#ffd166" stopOpacity="0.85" />
        <stop offset="1" stopColor="#ff9f1c" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="dw-flame" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#ff6b00" />
        <stop offset="0.6" stopColor="#ffd166" />
        <stop offset="1" stopColor="#fff3c4" />
      </linearGradient>
      <linearGradient id="dw-clay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9480f" />
        <stop offset="1" stopColor="#7c2d12" />
      </linearGradient>
    </defs>
  </svg>
)

const Diwali = () => {
  const reduced = useReducedMotion()
  const fire = useRef(() => {})

  const celebrate = (x, y) => {
    fire.current(x, y * 0.4)
    setTimeout(() => fire.current(), 250)
    setTimeout(() => fire.current(), 520)
  }

  return createPortal(
    <div className="diwali">
      <Defs />
      <Garland />
      {!reduced && <Fireworks fireRef={fire} auto />}
      <div className="diwali-diyas" aria-hidden="true">
        <Diya delay={0} />
        <Diya delay={-0.4} />
        <Diya delay={-0.9} />
      </div>
      <Gift onOpen={celebrate} />
    </div>,
    document.body
  )
}

export default Diwali
