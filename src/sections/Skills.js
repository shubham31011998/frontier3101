import { lazy, Suspense, useState } from 'react'
import { skillGroups } from '../data/resume'

const SkillsGlobe = lazy(() => import('../three/SkillsGlobe'))

const CATEGORY_HUES = {
  Frontend: 255,
  Backend: 190,
  'Product Design': 22,
  'AI · learning': 95,
  Tools: 320,
}

const Skills = () => {
  const [active, setActive] = useState('All')
  const categories = ['All', ...Object.keys(skillGroups)]

  return (
    <section className="section skills" id="skills">
      <div className="container">
        <header className="section__head" data-reveal>
          <p className="eyebrow">04 — Skills</p>
          <h2 className="section__title">
            A connected <span className="grad">stack</span>, end to end.
          </h2>
        </header>

        <div className="filters" role="tablist" aria-label="Filter skills" data-reveal>
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              className={`pill${active === c ? ' is-active' : ''}`}
              style={c !== 'All' ? { '--hue': CATEGORY_HUES[c] } : undefined}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="skills__grid">
          <div className="skills__stage" data-reveal>
            <Suspense fallback={<div className="stage-fallback" />}>
              <SkillsGlobe
                className="skills__canvas"
                groups={skillGroups}
                active={active}
                categoryHues={CATEGORY_HUES}
              />
            </Suspense>
            <p className="hint mono">drag to spin the network</p>
          </div>

          <div className="skills__lists">
            {Object.entries(skillGroups).map(([cat, list]) => (
              <div
                key={cat}
                className={`skill-group card${active === 'All' || active === cat ? '' : ' is-dim'}`}
                style={{ '--hue': CATEGORY_HUES[cat] }}
                data-reveal
              >
                <h3 className="skill-group__title">
                  <span className="swatch" /> {cat}
                </h3>
                <p className="skill-group__items">{list.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
