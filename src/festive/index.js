import { lazy, Suspense, useEffect, useState } from 'react'

// Diwali theme window, in the visitor's local time: 6 Nov 2026 until midnight
// starting 11 Nov 2026 (five days). After that nothing is loaded at all.
// Preview any time with ?diwali=1, or hide it with ?diwali=0.
const START = new Date(2026, 10, 6).getTime()
const END = new Date(2026, 10, 11).getTime()

const Diwali = lazy(() => import('./Diwali'))

const override = () => {
  const v = new URLSearchParams(window.location.search).get('diwali')
  return v === '1' ? true : v === '0' ? false : null
}

const isActive = () => {
  const o = override()
  if (o !== null) return o
  const now = Date.now()
  return now >= START && now < END
}

const Festive = () => {
  const [active, setActive] = useState(isActive)

  // If the page stays open past a boundary, switch the theme on or off live.
  useEffect(() => {
    if (override() !== null) return
    const now = Date.now()
    const next = now < START ? START : now < END ? END : null
    if (next === null) return
    const id = setTimeout(() => setActive(isActive()), Math.min(next - now + 50, 2 ** 31 - 1))
    return () => clearTimeout(id)
  }, [active])

  if (!active) return null
  return (
    <Suspense fallback={null}>
      <Diwali />
    </Suspense>
  )
}

export default Festive
