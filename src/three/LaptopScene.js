import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  PresentationControls,
  RoundedBox,
} from '@react-three/drei'
import * as THREE from 'three'
import SceneShell, { isCoarsePointer } from './SceneShell'
import { useReducedMotion, useTheme } from '../hooks'

const { damp } = THREE.MathUtils

const SCRIPT = [
  ['$', 'whoami'],
  ['>', 'Shubham Yaduvanshi — AI Software Developer'],
  ['$', 'cat stack.json'],
  ['>', '["React", "Next.js", "TypeScript", "Node", ".NET Core"]'],
  ['$', 'git log --career --oneline'],
  ['>', '2024  iCapital (Hexure) · Front End Engineer II'],
  ['>', '2022  Ohum Healthcare · Lead UI Developer'],
  ['$', 'ship --feature nigo-v2'],
  ['>', '✓ PDF upload → annotate → e-sign → in good order'],
  ['$', 'ai --integrate workflows'],
  ['>', '✓ Rule Builder   ✓ Tag suggestions   ✓ n8n'],
  ['$', 'open ./portfolio'],
]
const TOTAL_CHARS = SCRIPT.reduce((n, [, t]) => n + t.length, 0)

const SCREEN_THEMES = {
  dark: { bg: '#0b0d18', bar: '#141829', text: '#e9ecf5', prompt: '#a3ff5c', out: '#8f9bff', dim: '#5a6275' },
  light: { bg: '#0f1222', bar: '#1a1f36', text: '#eef0f8', prompt: '#a3ff5c', out: '#a5b4fc', dim: '#6b7389' },
}

// Draws the terminal into a 2D canvas used as the screen texture.
const useTerminalTexture = (themeName) => {
  const canvas = useMemo(() => {
    const el = document.createElement('canvas')
    el.width = 1024
    el.height = 640
    return el
  }, [])
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [canvas])

  const draw = (chars, blink) => {
    const ctx = canvas.getContext('2d')
    const c = SCREEN_THEMES[themeName]
    ctx.fillStyle = c.bg
    ctx.fillRect(0, 0, 1024, 640)
    ctx.fillStyle = c.bar
    ctx.fillRect(0, 0, 1024, 52)
    ;['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
      ctx.beginPath()
      ctx.arc(34 + i * 30, 26, 9, 0, Math.PI * 2)
      ctx.fillStyle = col
      ctx.fill()
    })
    ctx.fillStyle = c.dim
    ctx.font = '500 22px "JetBrains Mono", monospace'
    ctx.fillText('shubham@portfolio: ~', 400, 34)

    ctx.font = '500 25px "JetBrains Mono", monospace'
    let remaining = chars
    let y = 100
    for (const [kind, text] of SCRIPT) {
      if (remaining <= 0) break
      const shown = text.slice(0, remaining)
      remaining -= text.length
      let x = 36
      if (kind === '$') {
        ctx.fillStyle = c.prompt
        ctx.fillText('~ $', x, y)
        x += 62
        ctx.fillStyle = c.text
      } else {
        ctx.fillStyle = c.out
      }
      ctx.fillText(shown, x, y)
      if (remaining <= 0 && blink) {
        const w = ctx.measureText(shown).width
        ctx.fillStyle = c.prompt
        ctx.fillRect(x + w + 4, y - 22, 13, 28)
      }
      y += 44
    }
    if (chars >= TOTAL_CHARS && blink) {
      ctx.fillStyle = c.prompt
      ctx.fillRect(36, y - 22, 13, 28)
    }
    texture.needsUpdate = true
  }

  return [texture, draw]
}

const KEY_COLS = 13
const KEY_ROWS = 5

const Keyboard = ({ pressRef, color }) => {
  const mesh = useRef()
  const offsets = useRef(new Float32Array(KEY_COLS * KEY_ROWS))
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, dt) => {
    const o = offsets.current
    if (pressRef.current >= 0) {
      o[pressRef.current] = -0.018
      pressRef.current = -1
    }
    let i = 0
    for (let r = 0; r < KEY_ROWS; r++) {
      for (let col = 0; col < KEY_COLS; col++, i++) {
        o[i] = damp(o[i], 0, 12, dt)
        dummy.position.set(-1.2 + col * 0.2, 0.072 + o[i], -0.78 + r * 0.19)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, KEY_COLS * KEY_ROWS]}>
      <boxGeometry args={[0.165, 0.025, 0.155]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </instancedMesh>
  )
}

const Laptop = ({ reduced }) => {
  const { theme } = useTheme()
  const lid = useRef()
  const [open, setOpen] = useState(true)
  const typed = useRef(0)
  const lastDrawn = useRef(-1)
  const pressRef = useRef(-1)
  const [texture, draw] = useTerminalTexture(theme)

  const body = theme === 'dark' ? '#5b6178' : '#c9ccd6'
  const keys = theme === 'dark' ? '#11131c' : '#2a2e3d'
  const accent = theme === 'dark' ? '#7c5cff' : '#6d4dff'

  useEffect(() => {
    lastDrawn.current = -1
  }, [theme])

  // Wait until fonts are ready so the canvas uses JetBrains Mono.
  useEffect(() => {
    document.fonts?.ready.then(() => (lastDrawn.current = -1))
  }, [])

  useFrame((state, dt) => {
    // Closed = PI/2 (lid flat on the base), open = slightly reclined.
    const target = open ? -0.22 : Math.PI / 2 - 0.02
    lid.current.rotation.x = reduced ? target : damp(lid.current.rotation.x, target, 3.2, dt)

    const lidOpenEnough = lid.current.rotation.x < 0.4
    if (open && lidOpenEnough && typed.current < TOTAL_CHARS) {
      const before = Math.floor(typed.current)
      typed.current = reduced ? TOTAL_CHARS : Math.min(TOTAL_CHARS, typed.current + dt * 38)
      if (Math.floor(typed.current) !== before) {
        pressRef.current = Math.floor(Math.random() * KEY_COLS * KEY_ROWS)
      }
    }
    const blink = Math.floor(state.clock.elapsedTime * 2) % 2 === 0
    const key = Math.floor(typed.current) * 2 + (blink ? 1 : 0)
    if (key !== lastDrawn.current) {
      lastDrawn.current = key
      draw(Math.floor(typed.current), blink)
    }
  })

  const toggle = (e) => {
    e.stopPropagation()
    setOpen((o) => {
      if (o) typed.current = 0
      return !o
    })
  }

  return (
    <group
      position={[0, -0.6, 0]}
      onClick={toggle}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      {/* Base */}
      <RoundedBox args={[3, 0.12, 2.1]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color={body} metalness={0.85} roughness={0.28} />
      </RoundedBox>
      <Keyboard pressRef={pressRef} color={keys} />
      {/* Trackpad */}
      <RoundedBox args={[1, 0.01, 0.55]} radius={0.004} smoothness={2} position={[0, 0.062, 0.6]}>
        <meshStandardMaterial color={body} metalness={0.6} roughness={0.15} />
      </RoundedBox>
      {/* Lid, pivoting on the back hinge */}
      <group ref={lid} position={[0, 0.06, -1.03]} rotation-x={Math.PI / 2 - 0.02}>
        <RoundedBox args={[3, 2, 0.07]} radius={0.04} smoothness={4} position={[0, 1, 0]}>
          <meshStandardMaterial color={body} metalness={0.85} roughness={0.28} />
        </RoundedBox>
        {/* Bezel + screen */}
        <mesh position={[0, 1, 0.036]}>
          <planeGeometry args={[2.88, 1.88]} />
          <meshStandardMaterial color="#05060a" roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.02, 0.038]}>
          <planeGeometry args={[2.7, 1.69]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        {/* Glowing logo on the back */}
        <mesh position={[0, 1, -0.037]} rotation-y={Math.PI}>
          <circleGeometry args={[0.16, 48]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

const Scene = () => {
  const { theme } = useTheme()
  const reduced = useReducedMotion()
  const coarse = useMemo(isCoarsePointer, [])

  return (
    <>
      <ambientLight intensity={theme === 'dark' ? 0.5 : 0.9} />
      <spotLight position={[5, 8, 5]} angle={0.4} penumbra={1} intensity={80} castShadow={false} />
      <pointLight position={[-4, 2, -3]} intensity={20} color="#22d3ee" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 5, -5]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#7c5cff" position={[-5, 1, 2]} scale={[3, 5, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#22d3ee" position={[5, 1, 2]} scale={[3, 5, 1]} />
      </Environment>

      <PresentationControls
        enabled={!coarse}
        global={false}
        cursor
        snap
        speed={1.4}
        rotation={[0.32, -0.45, 0]}
        polar={[-0.3, 0.4]}
        azimuth={[-1.1, 1.1]}
      >
        <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <Laptop reduced={reduced} />
        </Float>
      </PresentationControls>

      <ContactShadows
        position={[0, -1.25, 0]}
        opacity={theme === 'dark' ? 0.6 : 0.35}
        scale={9}
        blur={2.6}
        far={3}
        color={theme === 'dark' ? '#000000' : '#3a3f5c'}
      />
    </>
  )
}

const LaptopScene = ({ className }) => (
  <SceneShell className={className} camera={{ position: [0, 1.6, 6.2], fov: 38 }}>
    <Scene />
  </SceneShell>
)

export default LaptopScene
