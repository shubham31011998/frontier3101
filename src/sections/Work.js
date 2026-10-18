import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { projects } from '../data/resume'

// Pointer-driven 3D tilt with a moving specular highlight.
const TiltCard = ({ project, index }) => {
  const ref = useRef()

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ref.current.style.setProperty('--rx', `${(0.5 - py) * 12}deg`)
    ref.current.style.setProperty('--ry', `${(px - 0.5) * 14}deg`)
    ref.current.style.setProperty('--mx', `${px * 100}%`)
    ref.current.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => {
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  const host = new URL(project.url).host

  return (
    <a
      ref={ref}
      className={`project${project.featured ? ' project--featured' : ''}`}
      href={project.url}
      target="_blank"
      rel="noreferrer"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ '--hue': project.hue }}
      data-reveal
    >
      <div className="project__inner">
        <div className="project__cover" aria-hidden="true">
          <div className="browser">
            <div className="browser__bar">
              <i />
              <i />
              <i />
              <span className="browser__url mono">{host}</span>
            </div>
            <div className="browser__body">
              <span className="project__mono">{project.name.slice(0, 2)}</span>
              <div className="skeleton">
                <b />
                <b />
                <b />
              </div>
            </div>
          </div>
        </div>
        <div className="project__body">
          <p className="project__idx mono">0{index + 1}</p>
          <h3 className="project__name">
            {project.name}
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="project__go" />
          </h3>
          <p className="project__blurb">{project.blurb}</p>
          <ul className="tags">
            {project.tags.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <span className="project__shine" aria-hidden="true" />
      </div>
    </a>
  )
}

const Work = () => (
  <section className="section work" id="work">
    <div className="container">
      <header className="section__head" data-reveal>
        <p className="eyebrow">05 — Selected work</p>
        <h2 className="section__title">
          Side projects I've <span className="grad">built & shipped</span>.
        </h2>
      </header>
      <div className="projects">
        {projects.map((p, i) => (
          <TiltCard key={p.name} project={p} index={i} />
        ))}
      </div>
    </div>
  </section>
)

export default Work
