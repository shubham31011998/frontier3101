import { Component, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useInView } from '../hooks'

class GLBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

// Wraps an R3F canvas: pauses the render loop while off-screen and falls back
// gracefully when WebGL is unavailable.
const SceneShell = ({ children, className, fallback = null, camera, dpr = [1, 2], ...rest }) => {
  const [ref, inView] = useInView({ rootMargin: '150px' })

  return (
    <div ref={ref} className={className}>
      <GLBoundary fallback={fallback}>
        <Canvas
          frameloop={inView ? 'always' : 'never'}
          dpr={dpr}
          camera={camera}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          {...rest}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      </GLBoundary>
    </div>
  )
}

export default SceneShell

export const isCoarsePointer = () => window.matchMedia?.('(pointer: coarse)').matches ?? false
