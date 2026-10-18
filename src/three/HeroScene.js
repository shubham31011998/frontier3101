import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import SceneShell from './SceneShell'
import { useReducedMotion, useTheme } from '../hooks'

const PALETTES = {
  dark: { core: '#7c5cff', glow: '#22d3ee', ring: '#a3ff5c', dust: '#a5b4fc', node: '#e9ecf5' },
  light: { core: '#6d4dff', glow: '#0891b2', ring: '#4d9e1a', dust: '#5b3df5', node: '#1e2235' },
}

const { damp } = THREE.MathUtils

// Window-wide pointer so the scene reacts even while the cursor is over the hero copy.
const usePointer = () => {
  const p = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1
      p.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return p
}

const Core = ({ colors, reduced }) => {
  const mesh = useRef()
  const shell = useRef()
  const mat = useRef()
  const pulse = useRef(0)
  const [hovered, setHovered] = useState(false)
  const [hueShift, setHueShift] = useState(0)

  const color = useMemo(() => {
    const c = new THREE.Color(colors.core)
    c.offsetHSL(hueShift, 0, 0)
    return c
  }, [colors.core, hueShift])

  useEffect(() => () => (document.body.style.cursor = ''), [])

  useFrame((_, dt) => {
    pulse.current = damp(pulse.current, 0, 2.2, dt)
    if (mat.current) {
      const target = (hovered ? 0.5 : 0.32) + pulse.current * 0.55
      mat.current.distort = damp(mat.current.distort, target, 4, dt)
    }
    mesh.current.scale.setScalar(1 + pulse.current * 0.22)
    shell.current.scale.setScalar(1.85 + pulse.current * 0.6)
    shell.current.material.opacity = 0.16 + pulse.current * 0.5
    if (!reduced) {
      mesh.current.rotation.y += dt * 0.18
      shell.current.rotation.x -= dt * 0.08
      shell.current.rotation.y += dt * 0.11
    }
  })

  return (
    <group>
      <mesh
        ref={mesh}
        onClick={(e) => {
          e.stopPropagation()
          pulse.current = 1
          setHueShift((h) => (h + 0.13) % 1)
        }}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = ''
        }}
      >
        <icosahedronGeometry args={[1.15, 48]} />
        <MeshDistortMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={0.18}
          roughness={0.12}
          metalness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={1}
          iridescenceIOR={1.4}
          distort={0.32}
          speed={reduced ? 0 : 1.8}
        />
      </mesh>
      <mesh ref={shell} scale={1.85}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={colors.glow} wireframe transparent opacity={0.16} />
      </mesh>
    </group>
  )
}

const Orbit = ({ radius, tilt, speed, color, offset = 0, reduced, children }) => {
  const arm = useRef()
  useFrame((_, dt) => {
    if (!reduced) arm.current.rotation.y += dt * speed
  })
  return (
    <group rotation={tilt}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[radius, 0.005, 8, 200]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      <group ref={arm} rotation-y={offset}>
        <group position={[radius, 0, 0]}>{children}</group>
      </group>
    </group>
  )
}

const Satellite = ({ children, color }) => {
  const ref = useRef()
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.9
    ref.current.rotation.y += dt * 0.6
  })
  return (
    <mesh ref={ref}>
      {children}
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
    </mesh>
  )
}

const Dust = ({ color, count = 1400 }) => {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.2 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.025} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  )
}

const Rig = ({ children, pointer, reduced }) => {
  const group = useRef()
  useFrame((_, dt) => {
    if (reduced) return
    group.current.rotation.y = damp(group.current.rotation.y, pointer.current.x * 0.4, 2.5, dt)
    group.current.rotation.x = damp(group.current.rotation.x, -pointer.current.y * 0.25, 2.5, dt)
    group.current.position.x = damp(group.current.position.x, pointer.current.x * 0.15, 2.5, dt)
  })
  return <group ref={group}>{children}</group>
}

const Scene = () => {
  const { theme } = useTheme()
  const reduced = useReducedMotion()
  const pointer = usePointer()
  const c = PALETTES[theme]

  return (
    <>
      <ambientLight intensity={theme === 'dark' ? 0.4 : 0.9} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-4, -2, 2]} intensity={30} color={c.glow} />
      <pointLight position={[3, -3, -2]} intensity={25} color={c.core} />
      <Environment resolution={128}>
        <Lightformer form="ring" intensity={3} color={c.glow} position={[-5, 2, -4]} scale={4} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[5, 4, 2]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} color={c.core} position={[0, -5, 3]} scale={[8, 2, 1]} />
      </Environment>

      <Rig pointer={pointer} reduced={reduced}>
        <Float speed={reduced ? 0 : 1.4} rotationIntensity={0.3} floatIntensity={0.8}>
          <Core colors={c} reduced={reduced} />
        </Float>

        <Orbit radius={2.4} tilt={[0.35, 0, 0.2]} speed={0.45} color={c.glow} reduced={reduced}>
          <Satellite color={c.glow}>
            <torusKnotGeometry args={[0.13, 0.045, 96, 12]} />
          </Satellite>
        </Orbit>
        <Orbit radius={2.95} tilt={[-0.5, 0, -0.35]} speed={-0.3} offset={2} color={c.core} reduced={reduced}>
          <Satellite color={c.node}>
            <octahedronGeometry args={[0.17]} />
          </Satellite>
        </Orbit>
        <Orbit radius={3.45} tilt={[1.2, 0.3, 0]} speed={0.22} offset={4} color={c.ring} reduced={reduced}>
          <Satellite color={c.ring}>
            <dodecahedronGeometry args={[0.15]} />
          </Satellite>
        </Orbit>

        <Sparkles count={60} scale={[7, 5, 7]} size={2.2} speed={reduced ? 0 : 0.35} color={c.glow} opacity={0.8} />
        <Dust color={c.dust} />
      </Rig>
    </>
  )
}

const HeroScene = ({ className }) => (
  <SceneShell
    className={className}
    camera={{ position: [0, 0, 7.8], fov: 45 }}
    fallback={<div className="orb-fallback" aria-hidden="true" />}
  >
    <Scene />
  </SceneShell>
)

export default HeroScene
