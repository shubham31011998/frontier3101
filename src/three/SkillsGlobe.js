import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import SceneShell, { isCoarsePointer } from './SceneShell'
import { useReducedMotion, useTheme } from '../hooks'

const RADIUS = 2.35

const fibonacciSphere = (n, r) => {
  const pts = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts.push(new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r))
  }
  return pts
}

// Connects each node to its nearest neighbours for a neural-network look.
const buildLinks = (pts, k = 2) => {
  const verts = []
  pts.forEach((a, i) => {
    pts
      .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
      .filter(({ j }) => j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, k)
      .forEach(({ j }) => verts.push(a.x, a.y, a.z, pts[j].x, pts[j].y, pts[j].z))
  })
  return new Float32Array(verts)
}

// Pulls the camera back on narrow (portrait) canvases so labels never clip.
const FitCamera = () => {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    camera.position.setLength(Math.max(6.4, 7.4 / aspect))
  }, [camera, size])
  return null
}

// Small pulsing wireframe nucleus at the centre of the network.
const Core = ({ color }) => {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ref.current.rotation.set(t * 0.4, t * 0.6, 0)
    ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.08)
  })
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

const Globe = ({ groups, active, categoryHues }) => {
  const { theme } = useTheme()
  const labels = useRef([])
  const camDir = useMemo(() => new THREE.Vector3(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const items = useMemo(() => {
    const flat = Object.entries(groups).flatMap(([cat, skills]) => skills.map((name) => ({ name, cat })))
    const pts = fibonacciSphere(flat.length, RADIUS)
    return flat.map((it, i) => ({ ...it, pos: pts[i] }))
  }, [groups])

  const links = useMemo(() => buildLinks(items.map((i) => i.pos)), [items])
  const lineColor = theme === 'dark' ? '#7c5cff' : '#5b3df5'

  // Fade and shrink labels on the far side of the globe.
  useFrame(({ camera }) => {
    camDir.copy(camera.position).normalize()
    items.forEach((it, i) => {
      const el = labels.current[i]
      if (!el) return
      const facing = tmp.copy(it.pos).normalize().dot(camDir)
      const t = (facing + 1) / 2
      el.style.opacity = (0.12 + 0.88 * t * t).toFixed(3)
      el.style.transform = `scale(${(0.7 + 0.35 * t).toFixed(3)})`
    })
  })

  return (
    <group>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.96, 36, 24]} />
        <meshBasicMaterial color={lineColor} wireframe transparent opacity={theme === 'dark' ? 0.06 : 0.05} />
      </mesh>
      <Core color={theme === 'dark' ? '#22d3ee' : '#0891b2'} />
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={links.length / 3} array={links} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={lineColor} transparent opacity={0.35} />
      </lineSegments>
      {items.map((it, i) => {
        const on = active === 'All' || active === it.cat
        return (
          <group key={it.name} position={it.pos}>
            <mesh>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color={`hsl(${categoryHues[it.cat]}, 90%, 65%)`} />
            </mesh>
            <Html center position={[0, 0.17, 0]} zIndexRange={[20, 0]}>
              <span
                ref={(el) => (labels.current[i] = el)}
                className={`skill-chip${on ? ' is-on' : ' is-off'}`}
                style={{ '--hue': categoryHues[it.cat] }}
              >
                {it.name}
              </span>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

const SkillsGlobe = ({ className, groups, active, categoryHues }) => {
  const reduced = useReducedMotion()
  const coarse = useMemo(isCoarsePointer, [])

  return (
    <SceneShell className={className} camera={{ position: [0, 0, 6.4], fov: 50 }} dpr={[1, 1.75]}>
      <FitCamera />
      <Globe groups={groups} active={active} categoryHues={categoryHues} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!coarse}
        autoRotate={!reduced}
        autoRotateSpeed={0.9}
        rotateSpeed={0.55}
        enableDamping
      />
    </SceneShell>
  )
}

export default SkillsGlobe
