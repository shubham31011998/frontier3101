import { useSyncExternalStore } from 'react'

// Detects a nearby magnet from phone sensors and exposes it to the 3D scene.
//
// Two sources, best first:
//  1. Raw magnetometer (Generic Sensor API) — Android Chrome, only when the
//     "Generic Sensor Extra Classes" flag is on. Gives a real field vector.
//  2. Compass heading (deviceorientation) — every phone. The heading is computed
//     from the magnetometer, so a magnet near the phone drags it off course.
//
// In both cases a slowly-adapting baseline represents "the Earth's field"; the
// deviation from it is the magnet. While the gyroscope says the phone itself is
// turning, the baseline follows the sensor so rotation isn't mistaken for a magnet.

const RAW_RANGE = 120 // µT of deviation that counts as "magnet touching the phone"
const COMPASS_RANGE = 70 // degrees of unexplained heading swing for full strength
const ROTATING = 25 // deg/s of gyro rotation above which changes are the phone turning
const BASELINE_TAU = 6 // seconds for the baseline to absorb a magnet left in place
const NO_DATA_TIMEOUT = 1500

// Read every frame by the scene; mutated in place to avoid React re-renders.
export const magnet = { x: 0, y: 0, strength: 0, taps: 0 }

let snap = { status: 'off', source: null } // status: off | requesting | on | unsupported | denied
const subs = new Set()
const setSnap = (next) => {
  snap = { ...snap, ...next }
  subs.forEach((fn) => fn())
}

export const useMagnetStatus = () =>
  useSyncExternalStore(
    (fn) => {
      subs.add(fn)
      return () => subs.delete(fn)
    },
    () => snap
  )

export const canUseMagnet = () =>
  typeof window !== 'undefined' &&
  'DeviceOrientationEvent' in window &&
  (window.matchMedia?.('(pointer: coarse)').matches ?? false)

const clamp = (v, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v))
const angleDiff = (a, b) => ((a - b + 540) % 360) - 180
const ease = (dt) => 1 - Math.exp(-dt / BASELINE_TAU)

// ---- shared state ----
let rotating = 0
let lastLow = 0
let armed = true
let cleanup = []
let dataTimer = null

// A "tap" is the magnet flicked in close and back out quickly.
const publish = (x, y, strength) => {
  magnet.x = x
  magnet.y = y
  magnet.strength = strength
  const now = performance.now()
  if (strength < 0.25) {
    lastLow = now
    armed = true
  } else if (strength > 0.65 && armed) {
    armed = false
    if (now - lastLow < 300) magnet.taps += 1
  }
}

const gotData = () => {
  if (dataTimer) {
    clearTimeout(dataTimer)
    dataTimer = null
  }
}

const listen = (target, type, fn) => {
  target.addEventListener(type, fn)
  cleanup.push(() => target.removeEventListener(type, fn))
}

const onMotion = (e) => {
  const r = e.rotationRate
  if (r) rotating = Math.hypot(r.alpha || 0, r.beta || 0, r.gamma || 0)
}

// ---- source 2: compass heading ----
const startCompass = () => {
  let baseline = null
  let lastT = 0
  const onOrientation = (e) => {
    let heading = e.webkitCompassHeading
    if (heading == null && e.absolute && e.alpha != null) heading = 360 - e.alpha
    if (heading == null || Number.isNaN(heading)) return
    gotData()

    const now = performance.now()
    const dt = lastT ? Math.min((now - lastT) / 1000, 0.5) : 0
    lastT = now

    if (baseline == null || rotating > ROTATING) baseline = heading
    else baseline = (baseline + angleDiff(heading, baseline) * ease(dt) + 360) % 360

    const x = clamp(angleDiff(heading, baseline) / COMPASS_RANGE)
    publish(x, 0, Math.abs(x))
  }
  const type = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation'
  listen(window, type, onOrientation)
  setSnap({ status: 'on', source: 'compass' })
}

// ---- source 1: raw magnetometer ----
const startMagnetometer = () =>
  new Promise((resolve) => {
    if (!('Magnetometer' in window)) return resolve(false)
    try {
      // eslint-disable-next-line no-undef
      const sensor = new Magnetometer({ frequency: 30 })
      let base = null
      let lastT = 0
      sensor.addEventListener('reading', () => {
        gotData()
        const v = [sensor.x, sensor.y, sensor.z]
        const now = performance.now()
        const dt = lastT ? Math.min((now - lastT) / 1000, 0.5) : 0
        lastT = now
        if (!base || rotating > ROTATING) base = v
        else base = base.map((b, i) => b + (v[i] - b) * ease(dt))

        const d = v.map((c, i) => c - base[i])
        publish(clamp(d[0] / RAW_RANGE), clamp(d[1] / RAW_RANGE), clamp(Math.hypot(...d) / RAW_RANGE, 0, 1))
        resolve(true)
      })
      sensor.addEventListener('error', () => {
        sensor.stop()
        resolve(false)
      })
      sensor.start()
      cleanup.push(() => sensor.stop())
      setSnap({ status: 'on', source: 'magnetometer' })
      setTimeout(() => resolve(false), 800)
    } catch {
      resolve(false)
    }
  })

// Must be called from a user gesture (iOS permission prompt).
export const enableMagnet = async () => {
  if (snap.status === 'on' || snap.status === 'requesting') return
  setSnap({ status: 'requesting' })

  // iOS 13+: request both permissions in the same gesture, without awaiting in between.
  const asks = [window.DeviceOrientationEvent, window.DeviceMotionEvent]
    .filter((C) => typeof C?.requestPermission === 'function')
    .map((C) => C.requestPermission())
  try {
    const results = await Promise.all(asks)
    if (results.some((r) => r !== 'granted')) return setSnap({ status: 'denied' })
  } catch {
    return setSnap({ status: 'denied' })
  }

  listen(window, 'devicemotion', onMotion)
  dataTimer = setTimeout(() => {
    disableMagnet()
    setSnap({ status: 'unsupported' })
  }, NO_DATA_TIMEOUT + 1000)

  const raw = await startMagnetometer()
  if (!raw) {
    // Drop any half-started magnetometer, keep the motion listener.
    cleanup.splice(1).forEach((fn) => fn())
    startCompass()
  }
}

export const disableMagnet = () => {
  cleanup.forEach((fn) => fn())
  cleanup = []
  gotData()
  publish(0, 0, 0)
  setSnap({ status: 'off', source: null })
}
