import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faGamepad } from '@fortawesome/free-solid-svg-icons'
import { education, profile, stats } from '../data/resume'
import portrait from '../assets/images/portrait.webp'

const CHIPS = [
  { label: 'Figma', x: '-8%', y: '14%', z: 70, hue: 330 },
  { label: 'React', x: '80%', y: '20%', z: 90, hue: 190 },
  { label: 'Photoshop', x: '74%', y: '52%', z: 60, hue: 215 },
  { label: 'Three.js', x: '-10%', y: '62%', z: 80, hue: 95 },
  { label: '✦ learning AI', x: '30%', y: '-3%', z: 110, hue: 265 },
]

// Holographic ID-card portrait with pointer-driven depth parallax.
const PortraitCard = () => {
  const ref = useRef()

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ref.current.style.setProperty('--rx', `${(0.5 - py) * 14}deg`)
    ref.current.style.setProperty('--ry', `${(px - 0.5) * 16}deg`)
    ref.current.style.setProperty('--mx', `${px * 100}%`)
    ref.current.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => {
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  return (
    <div className="portrait" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} data-reveal>
      <div className="portrait__card">
        <div className="portrait__ring" aria-hidden="true" />
        <figure className="portrait__frame">
          <img src={portrait} alt={`Portrait of ${profile.name}`} width="900" height="1200" loading="lazy" />
          <span className="portrait__holo" aria-hidden="true" />
        </figure>
        <figcaption className="portrait__plate">
          <span className="pulse-dot" />
          <div>
            <b>{profile.name}</b>
            <span className="mono">AI Developer · Product Designer</span>
          </div>
        </figcaption>
        {CHIPS.map((c) => (
          <span
            key={c.label}
            className="portrait__chip mono"
            style={{ left: c.x, top: c.y, '--z': `${c.z}px`, '--hue': c.hue }}
            aria-hidden="true"
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

const About = () => (
  <section className="section about" id="about">
    <div className="container">
      <header className="section__head" data-reveal>
        <p className="eyebrow">01 — About</p>
        <h2 className="section__title">
          Engineering interfaces that feel <span className="grad">effortless</span>.
        </h2>
      </header>

      <div className="about__grid">
        <PortraitCard />

        <div className="about__copy" data-reveal>
          <p className="lead">{profile.summary}</p>
          <p>
            I'm the rare hybrid who can <strong>design it and build it</strong>. I sketch physical-product concepts,
            composite visuals in <strong>Photoshop</strong>, craft flows and design systems in <strong>Figma</strong>,
            then ship them in React. By day that means enterprise products like <strong>FireLight</strong> at iCapital
            and <strong>IHMS</strong> for the Rajasthan Government. Right now I'm going deep on <strong>AI</strong>.
          </p>

          <ul className="stats">
            {stats.map((s) => (
              <li key={s.label} className="stat card">
                <span className="stat__value grad">{s.value}</span>
                <span className="stat__label">{s.label}</span>
              </li>
            ))}
          </ul>

          <div className="about__extras">
            <div className="mini card">
              <FontAwesomeIcon icon={faGraduationCap} className="mini__icon" />
              <div>
                <p className="mini__title">{education.degree}</p>
                <p className="mini__meta">
                  {education.school} · {education.period}
                </p>
              </div>
            </div>
            <a className="mini card" href={profile.youtube} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faGamepad} className="mini__icon" />
              <div>
                <p className="mini__title">Beyond code</p>
                <p className="mini__meta">I run a gaming YouTube channel with a team of creators ↗</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default About
