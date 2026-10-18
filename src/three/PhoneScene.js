import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer, OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import SceneShell, { isCoarsePointer } from './SceneShell'
import { useReducedMotion, useTheme } from '../hooks'

const { damp } = THREE.MathUtils

const SPECS = {
  display: { name: 'Display', spec: '6.1" OLED · 120 Hz' },
  frame: { name: 'Frame', spec: 'Aluminium unibody' },
  board: { name: 'Logic board', spec: 'SoC · 5G · NFC' },
  battery: { name: 'Battery', spec: '4,000 mAh Li-ion' },
  back: { name: 'Back glass', spec: 'Frosted glass · triple camera' },
}

export const FINISHES = {
  Matte: { roughness: 0.75, clearcoat: 0 },
  Satin: { roughness: 0.4, clearcoat: 0.3 },
  Gloss: { roughness: 0.12, clearcoat: 1 },
}

// Assembled vs exploded Z positions (front → back).
const LAYOUT = {
  display: [0.082, 1.35],
  frame: [0, 0.5],
  board: [0, -0.25],
  battery: [0, -0.85],
  back: [-0.082, -1.5],
}

/* ---------- App UI, drawn into a canvas texture ---------- */
const W = 600
const H = 1296
const SIG = Array.from({ length: 60 }, (_, i) => {
  const t = i / 59
  return [150 + t * 300, 905 - Math.sin(t * Math.PI * 3.2) * 26 * (1 - t * 0.4) - Math.sin(t * 19) * 8]
})

const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

const drawApp = (ctx, screen, t, accent, on) => {
  ctx.clearRect(0, 0, W, H)
  ctx.save()
  rr(ctx, 0, 0, W, H, 72)
  ctx.clip()

  if (!on) {
    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, '#0d0f16')
    g.addColorStop(0.5, '#05060a')
    g.addColorStop(1, '#0d0f16')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    ctx.restore()
    return
  }

  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#0b0d18')
  bg.addColorStop(1, '#141832')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Status bar + dynamic island
  ctx.fillStyle = '#fff'
  ctx.font = '600 28px "Space Grotesk", sans-serif'
  ctx.fillText('9:41', 52, 62)
  ctx.fillStyle = '#000'
  rr(ctx, 220, 26, 160, 46, 23)
  ctx.fill()
  ctx.fillStyle = '#fff'
  for (let i = 0; i < 4; i++) ctx.fillRect(470 + i * 10, 56 - i * 6, 6, 8 + i * 6)
  rr(ctx, 520, 40, 40, 20, 6)
  ctx.fill()

  const muted = 'rgba(233,236,245,0.55)'

  if (screen === 'Home') {
    ctx.fillStyle = muted
    ctx.font = '400 30px "Space Grotesk", sans-serif'
    ctx.fillText('Good evening,', 48, 160)
    ctx.fillStyle = '#fff'
    ctx.font = '700 54px "Space Grotesk", sans-serif'
    ctx.fillText('Shubham', 48, 218)

    const card = ctx.createLinearGradient(40, 260, 560, 560)
    card.addColorStop(0, accent)
    card.addColorStop(1, '#22d3ee')
    ctx.fillStyle = card
    rr(ctx, 40, 260, 520, 300, 40)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = '500 26px "Space Grotesk", sans-serif'
    ctx.fillText('Total balance', 76, 318)
    ctx.fillStyle = '#fff'
    ctx.font = '700 66px "Space Grotesk", sans-serif'
    ctx.fillText('$24,830', 76, 394)
    ctx.font = '500 24px "Space Grotesk", sans-serif'
    ctx.fillText('▲ 4.8% this month', 76, 436)
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx.lineWidth = 5
    ctx.lineJoin = 'round'
    ctx.beginPath()
    for (let x = 0; x <= 440; x += 8) {
      const y = 510 - Math.sin(x / 45 + t * 1.6) * 18 - x * 0.07
      x === 0 ? ctx.moveTo(80 + x, y) : ctx.lineTo(80 + x, y)
    }
    ctx.stroke()

    ;['Send', 'Pay', 'Save', 'More'].forEach((label, i) => {
      const cx = 105 + i * 130
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.beginPath()
      ctx.arc(cx, 650, 46, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = i === 0 ? accent : '#fff'
      ctx.beginPath()
      ctx.arc(cx, 650, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = muted
      ctx.font = '500 22px "Space Grotesk", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(label, cx, 730)
      ctx.textAlign = 'left'
    })

    const rows = [
      ['Policy premium', 'Today · FireLight', '-$320'],
      ['Design retainer', 'Yesterday', '+$2,400'],
      ['Cloud hosting', 'Mon', '-$48'],
    ]
    rows.forEach(([title, sub, amt], i) => {
      const y = 800 + i * 118
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      rr(ctx, 40, y, 520, 100, 24)
      ctx.fill()
      ctx.fillStyle = i === 1 ? '#a3ff5c' : accent
      ctx.beginPath()
      ctx.arc(94, y + 50, 26, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = '600 26px "Space Grotesk", sans-serif'
      ctx.fillText(title, 140, y + 44)
      ctx.fillStyle = muted
      ctx.font = '400 21px "Space Grotesk", sans-serif'
      ctx.fillText(sub, 140, y + 74)
      ctx.fillStyle = amt.startsWith('+') ? '#a3ff5c' : '#fff'
      ctx.font = '600 26px "Space Grotesk", sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(amt, 530, y + 58)
      ctx.textAlign = 'left'
    })
  }

  if (screen === 'Stats') {
    ctx.fillStyle = '#fff'
    ctx.font = '700 50px "Space Grotesk", sans-serif'
    ctx.fillText('Activity', 48, 190)
    const p = 0.68 + Math.sin(t * 1.2) * 0.08
    ctx.lineCap = 'round'
    ctx.lineWidth = 36
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.beginPath()
    ctx.arc(300, 440, 150, 0, Math.PI * 2)
    ctx.stroke()
    ctx.strokeStyle = accent
    ctx.beginPath()
    ctx.arc(300, 440, 150, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p)
    ctx.stroke()
    ctx.lineWidth = 22
    ctx.strokeStyle = '#22d3ee'
    ctx.beginPath()
    ctx.arc(300, 440, 105, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (p - 0.2))
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.font = '700 64px "Space Grotesk", sans-serif'
    ctx.fillText(`${Math.round(p * 100)}%`, 300, 462)
    ctx.fillStyle = muted
    ctx.font = '500 22px "Space Grotesk", sans-serif'
    ctx.fillText('weekly goal', 300, 500)

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    days.forEach((d, i) => {
      const h = 90 + 170 * (0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.9))
      const x = 70 + i * 70
      const g = ctx.createLinearGradient(0, 1050 - h, 0, 1050)
      g.addColorStop(0, i === 4 ? '#a3ff5c' : accent)
      g.addColorStop(1, 'rgba(255,255,255,0.05)')
      ctx.fillStyle = g
      rr(ctx, x - 22, 1050 - h, 44, h, 14)
      ctx.fill()
      ctx.fillStyle = muted
      ctx.fillText(d, x, 1095)
    })
    ctx.textAlign = 'left'
  }

  if (screen === 'Sign') {
    ctx.fillStyle = '#fff'
    ctx.font = '700 42px "Space Grotesk", sans-serif'
    ctx.fillText('Annuity application', 48, 175)
    ctx.fillStyle = accent
    rr(ctx, 48, 196, 210, 40, 12)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = '600 20px "JetBrains Mono", monospace'
    ctx.fillText('PDF · NIGO V2', 64, 223)

    // Paper
    ctx.fillStyle = '#f6f7fb'
    rr(ctx, 40, 262, 520, 720, 22)
    ctx.fill()
    ctx.fillStyle = '#d5d9e4'
    for (let i = 0; i < 11; i++) {
      const w = i % 4 === 3 ? 260 : 440
      rr(ctx, 80, 312 + i * 44, w, 12, 6)
      ctx.fill()
    }
    // Annotation highlight
    const pulse = 0.25 + 0.1 * Math.sin(t * 3)
    ctx.fillStyle = `rgba(255, 196, 0, ${pulse})`
    rr(ctx, 70, 432, 460, 34, 8)
    ctx.fill()
    ctx.fillStyle = '#ff7a1a'
    rr(ctx, 360, 396, 170, 32, 10)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = '600 18px "Space Grotesk", sans-serif'
    ctx.fillText('Agent note ✎', 378, 418)

    // Signature
    ctx.strokeStyle = '#b5bccb'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 8])
    ctx.beginPath()
    ctx.moveTo(80, 930)
    ctx.lineTo(520, 930)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#8a91a5'
    ctx.font = '500 18px "Space Grotesk", sans-serif'
    ctx.fillText('Sign here ✕', 80, 960)

    const progress = Math.min(1, (t % 6) / 3)
    const n = Math.floor(progress * (SIG.length - 1))
    ctx.strokeStyle = '#1e2a78'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.beginPath()
    SIG.slice(0, n + 1).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke()

    const done = progress >= 1
    ctx.fillStyle = done ? '#2fbf5b' : 'rgba(255,255,255,0.1)'
    rr(ctx, 40, 1010, 520, 92, 28)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.font = '600 28px "Space Grotesk", sans-serif'
    ctx.fillText(done ? '✓ Submitted · In good order' : 'Sign to submit', 300, 1066)
    ctx.textAlign = 'left'
  }

  // Tab bar
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(0, 1150, W, 146)
  ;['Home', 'Stats', 'Sign'].forEach((name, i) => {
    const cx = 120 + i * 180
    const active = name === screen
    ctx.fillStyle = active ? accent : 'rgba(255,255,255,0.35)'
    rr(ctx, cx - 22, 1180, 44, 44, 12)
    ctx.fill()
    ctx.font = '500 20px "Space Grotesk", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(name, cx, 1252)
    ctx.textAlign = 'left'
  })
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  rr(ctx, 220, 1270, 160, 8, 4)
  ctx.fill()

  ctx.restore()
}

const useAppTexture = () => {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    return c
  }, [])
  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [canvas])
  return [canvas, texture]
}

/* ---------- 3D model ---------- */
const Part = ({ id, selected, exploded, reduced, onPick, children }) => {
  const ref = useRef()
  const [from, to] = LAYOUT[id]

  useFrame((_, dt) => {
    const z = exploded ? to : from
    ref.current.position.z = reduced ? z : damp(ref.current.position.z, z, 5, dt)
  })

  return (
    <group
      ref={ref}
      position-z={from}
      onClick={(e) => {
        e.stopPropagation()
        onPick(id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      {children}
      {selected === id && (
        <Html position={[1.05, 0.9, 0]} zIndexRange={[30, 0]} className="part-tag-wrap">
          <div className="part-tag">
            <b>{SPECS[id].name}</b>
            <span>{SPECS[id].spec}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

const Phone = ({ colorway, finish, exploded, screenOn, screen, selected, onSelect, onTapScreen, reduced }) => {
  const [canvas, texture] = useAppTexture()
  const last = useRef(-1)
  const f = FINISHES[finish]
  const glow = (id) => (selected === id ? 0.35 : 0)

  useEffect(() => {
    last.current = -1
  }, [screen, screenOn, colorway])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // Redraw the app at ~30 fps (once when the screen is off).
    if (screenOn ? t - last.current > 1 / 30 : last.current < 0) {
      last.current = t
      drawApp(canvas.getContext('2d'), screen, reduced ? 3 : t, colorway.accent, screenOn)
      texture.needsUpdate = true
    }
  })

  const pick = (id) => {
    onSelect(id)
    if (id === 'display') onTapScreen()
  }
  const common = { selected, exploded, reduced, onPick: pick }

  return (
    <group>
      <Part id="display" {...common}>
        <RoundedBox args={[1.47, 3.07, 0.014]} radius={0.007} smoothness={2}>
          <meshStandardMaterial color="#05060a" roughness={0.15} emissive={colorway.accent} emissiveIntensity={glow('display')} />
        </RoundedBox>
        <mesh position-z={0.009}>
          <planeGeometry args={[1.39, 3.0]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      </Part>

      <Part id="frame" {...common}>
        <RoundedBox args={[1.52, 3.12, 0.15]} radius={0.07} smoothness={6}>
          <meshPhysicalMaterial
            color={colorway.frame}
            metalness={0.85}
            roughness={f.roughness}
            clearcoat={f.clearcoat}
            emissive={colorway.accent}
            emissiveIntensity={glow('frame')}
          />
        </RoundedBox>
        {[0.75, 0.45].map((y) => (
          <mesh key={y} position={[-0.77, y, 0]}>
            <boxGeometry args={[0.025, 0.22, 0.05]} />
            <meshStandardMaterial color={colorway.frame} metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0.77, 0.6, 0]}>
          <boxGeometry args={[0.025, 0.36, 0.05]} />
          <meshStandardMaterial color={colorway.frame} metalness={0.9} roughness={0.3} />
        </mesh>
      </Part>

      <Part id="board" {...common}>
        <RoundedBox args={[1.25, 1.25, 0.03]} radius={0.01} smoothness={2} position-y={0.75}>
          <meshStandardMaterial color="#0f3d2e" roughness={0.6} emissive={colorway.accent} emissiveIntensity={glow('board')} />
        </RoundedBox>
        {[
          [-0.25, 0.95, 0.38, 0.38, '#20232c'],
          [0.25, 0.95, 0.3, 0.22, '#c9ccd6'],
          [0.25, 0.55, 0.32, 0.3, '#20232c'],
          [-0.3, 0.45, 0.24, 0.18, '#c9a227'],
        ].map(([x, y, w, h, c], i) => (
          <mesh key={i} position={[x, y, 0.03]}>
            <boxGeometry args={[w, h, 0.03]} />
            <meshStandardMaterial color={c} metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
      </Part>

      <Part id="battery" {...common}>
        <RoundedBox args={[1.2, 1.55, 0.07]} radius={0.03} smoothness={4} position-y={-0.6}>
          <meshStandardMaterial
            color="#2a2e3a"
            metalness={0.4}
            roughness={0.5}
            emissive={colorway.accent}
            emissiveIntensity={glow('battery')}
          />
        </RoundedBox>
        <mesh position={[0, -0.6, 0.037]}>
          <planeGeometry args={[0.8, 0.3]} />
          <meshBasicMaterial color={colorway.accent} />
        </mesh>
      </Part>

      <Part id="back" {...common}>
        <RoundedBox args={[1.48, 3.08, 0.02]} radius={0.01} smoothness={2}>
          <meshPhysicalMaterial
            color={colorway.back}
            roughness={0.35}
            clearcoat={1}
            emissive={colorway.accent}
            emissiveIntensity={glow('back')}
          />
        </RoundedBox>
        <RoundedBox args={[0.62, 0.62, 0.05]} radius={0.12} smoothness={4} position={[0.36, 1.1, -0.03]}>
          <meshPhysicalMaterial color={colorway.back} roughness={0.2} clearcoat={1} />
        </RoundedBox>
        {[
          [0.24, 1.22],
          [0.48, 0.98],
          [0.24, 0.98],
        ].map(([x, y]) => (
          <group key={`${x}${y}`} position={[x, y, -0.065]} rotation-x={Math.PI / 2}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 0.04, 32]} />
              <meshStandardMaterial color="#14161d" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position-y={-0.021}>
              <circleGeometry args={[0.06, 32]} />
              <meshStandardMaterial color="#1a2340" metalness={1} roughness={0} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.5, 1.22, -0.06]} rotation-y={Math.PI}>
          <circleGeometry args={[0.035, 24]} />
          <meshBasicMaterial color="#fff6d6" />
        </mesh>
      </Part>
    </group>
  )
}

// Gentle idle sway that keeps the app screen facing the viewer.
const Sway = ({ reduced, children }) => {
  const ref = useRef()
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    const y = reduced ? -0.35 : -0.35 + Math.sin(t * 0.45) * 0.4
    const x = reduced ? 0.06 : 0.06 + Math.sin(t * 0.7) * 0.05
    ref.current.rotation.y = damp(ref.current.rotation.y, y, 2, dt)
    ref.current.rotation.x = damp(ref.current.rotation.x, x, 2, dt)
    ref.current.position.y = reduced ? 0.05 : 0.05 + Math.sin(t * 0.9) * 0.06
  })
  return (
    <group ref={ref} rotation={[0.06, -0.35, 0.03]}>
      {children}
    </group>
  )
}

const Scene = (props) => {
  const { theme } = useTheme()
  const reduced = useReducedMotion()
  const coarse = useMemo(isCoarsePointer, [])

  useEffect(() => () => (document.body.style.cursor = ''), [])

  return (
    <>
      <ambientLight intensity={theme === 'dark' ? 0.55 : 0.9} />
      <spotLight position={[4, 7, 6]} angle={0.45} penumbra={1} intensity={90} />
      <pointLight position={[-4, 1, -3]} intensity={25} color={props.colorway.accent} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, -4]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 1, 3]} scale={[3, 6, 1]} />
        <Lightformer form="ring" intensity={2} color={props.colorway.accent} position={[5, 2, 2]} scale={3} />
      </Environment>

      <Sway reduced={reduced || !!props.selected}>
        <Phone {...props} reduced={reduced} />
      </Sway>

      <ContactShadows
        position={[0, -1.95, 0]}
        opacity={theme === 'dark' ? 0.5 : 0.28}
        scale={7}
        blur={2.6}
        far={4}
        color={theme === 'dark' ? '#000000' : '#3a3f5c'}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!coarse}
        minPolarAngle={0.8}
        maxPolarAngle={2.0}
        enableDamping
      />
    </>
  )
}

const PhoneScene = ({ className, onMiss, ...props }) => (
  <SceneShell className={className} camera={{ position: [0, 0.3, 5.6], fov: 40 }} onPointerMissed={onMiss}>
    <Scene {...props} />
  </SceneShell>
)

export default PhoneScene
