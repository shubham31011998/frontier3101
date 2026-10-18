import { lazy, Suspense, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowPointer,
  faCompassDrafting,
  faCube,
  faExpand,
  faFont,
  faHashtag,
  faLightbulb,
  faMobileScreenButton,
  faPalette,
  faPenNib,
  faRobot,
  faWandMagicSparkles,
  faLayerGroup,
  faRegistered,
} from '@fortawesome/free-solid-svg-icons'
import { disciplines, process } from '../data/resume'

const PhoneScene = lazy(() => import('../three/PhoneScene'))

// Kept in sync with SPECS / FINISHES in PhoneScene (duplicated so the lazy
// 3D chunk isn't pulled into the main bundle).
const PART_LIST = [
  { id: 'display', name: 'Display' },
  { id: 'frame', name: 'Frame' },
  { id: 'board', name: 'Logic board' },
  { id: 'battery', name: 'Battery' },
  { id: 'back', name: 'Back glass' },
]
const FINISH_NAMES = ['Matte', 'Satin', 'Gloss']
const SCREENS = ['Home', 'Stats', 'Sign']

const COLORWAYS = [
  { name: 'Midnight', frame: '#3a3f4e', back: '#1c1f28', accent: '#7c5cff' },
  { name: 'Ember', frame: '#c8571f', back: '#e2733d', accent: '#ff7a1a' },
  { name: 'Sand', frame: '#cdbb98', back: '#ece3d3', accent: '#ff6b4a' },
  { name: 'Sage', frame: '#93ab8e', back: '#c9d6c4', accent: '#22d3ee' },
  { name: 'Arctic', frame: '#c6ccd8', back: '#eef1f6', accent: '#5b8cff' },
]

const ICONS = {
  compass: faCompassDrafting,
  mobile: faMobileScreenButton,
  cube: faCube,
  palette: faPalette,
  wand: faWandMagicSparkles,
  robot: faRobot,
}

const Design = () => {
  const [colorway, setColorway] = useState(COLORWAYS[1])
  const [finish, setFinish] = useState('Satin')
  const [exploded, setExploded] = useState(false)
  const [screenOn, setScreenOn] = useState(true)
  const [screen, setScreen] = useState('Home')
  const [selected, setSelected] = useState(null)

  const select = (id) => {
    setSelected((s) => (s === id ? null : id))
    // Internal parts are hidden until the phone is pulled apart.
    if (id === 'board' || id === 'battery') setExploded(true)
  }
  const nextScreen = () => {
    setScreenOn(true)
    setScreen((s) => SCREENS[(SCREENS.indexOf(s) + 1) % SCREENS.length])
  }

  return (
    <section className="section design" id="design">
      <div className="container">
        <header className="section__head" data-reveal>
          <p className="eyebrow">02 — Design studio</p>
          <h2 className="section__title">
            A designer's eye, an <span className="grad">engineer's hands</span>.
          </h2>
          <p className="section__sub">
            I design products end to end, from Figma frames and physical-product concepts to the production code that
            ships them. Try it: this phone concept, and the app running on it, were designed and built right here in code.
          </p>
        </header>

        <div className="editor card card--glass" data-reveal>
          <div className="editor__bar">
            <div className="editor__tools" aria-hidden="true">
              <span className="is-on">
                <FontAwesomeIcon icon={faArrowPointer} />
              </span>
              <span>
                <FontAwesomeIcon icon={faHashtag} />
              </span>
              <span>
                <FontAwesomeIcon icon={faPenNib} />
              </span>
              <span>
                <FontAwesomeIcon icon={faFont} />
              </span>
            </div>
            <p className="editor__file mono">
              orbit-phone <span>/ app + device v3</span>
            </p>
            <div className="editor__meta mono" aria-hidden="true">
              <span className="avatar-dot" style={{ '--c': '#ff7a1a' }}>
                S
              </span>
              <span>100%</span>
            </div>
          </div>

          <div className="editor__body">
            <aside className="editor__layers" aria-label="Product layers">
              <p className="panel-title">
                <FontAwesomeIcon icon={faLayerGroup} /> Layers
              </p>
              <ul>
                {PART_LIST.map((p) => (
                  <li key={p.id}>
                    <button
                      className={selected === p.id ? 'is-active' : undefined}
                      onClick={() => select(p.id)}
                      aria-pressed={selected === p.id}
                    >
                      <FontAwesomeIcon icon={faCube} /> {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="editor__canvas">
              <span className="frame-label mono">Frame · Orbit / {screen}</span>
              <Suspense fallback={<div className="stage-fallback" />}>
                <PhoneScene
                  className="editor__gl"
                  colorway={colorway}
                  finish={finish}
                  exploded={exploded}
                  screenOn={screenOn}
                  screen={screen}
                  selected={selected}
                  onSelect={select}
                  onTapScreen={nextScreen}
                  onMiss={() => setSelected(null)}
                />
              </Suspense>
              <p className="hint mono">drag to orbit · tap the screen · click a part</p>
            </div>

            <aside className="editor__props" aria-label="Design properties">
              <div className="prop">
                <p className="panel-title">
                  <FontAwesomeIcon icon={faPalette} /> Colourway · <b>{colorway.name}</b>
                </p>
                <div className="swatches">
                  {COLORWAYS.map((c) => (
                    <button
                      key={c.name}
                      className={`swatch-btn${c.name === colorway.name ? ' is-active' : ''}`}
                      style={{ '--a': c.back, '--b': c.accent }}
                      onClick={() => setColorway(c)}
                      aria-label={`${c.name} colourway`}
                      aria-pressed={c.name === colorway.name}
                    />
                  ))}
                </div>
              </div>
              <div className="prop">
                <p className="panel-title">
                  <FontAwesomeIcon icon={faRegistered} /> Finish
                </p>
                <div className="segmented" role="group" aria-label="Finish">
                  {FINISH_NAMES.map((f) => (
                    <button key={f} className={finish === f ? 'is-active' : undefined} onClick={() => setFinish(f)}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="prop">
                <p className="panel-title">
                  <FontAwesomeIcon icon={faMobileScreenButton} /> App screen
                </p>
                <div className="segmented" role="group" aria-label="App screen">
                  {SCREENS.map((s) => (
                    <button
                      key={s}
                      className={screen === s ? 'is-active' : undefined}
                      onClick={() => {
                        setScreen(s)
                        setScreenOn(true)
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="prop prop--row">
                <button className={`toggle${exploded ? ' is-on' : ''}`} onClick={() => setExploded((e) => !e)}>
                  <FontAwesomeIcon icon={faExpand} /> Exploded view
                </button>
                <button className={`toggle${screenOn ? ' is-on' : ''}`} onClick={() => setScreenOn((o) => !o)}>
                  <FontAwesomeIcon icon={faLightbulb} /> Screen on
                </button>
              </div>
              <dl className="spec mono">
                <div>
                  <dt>Product</dt>
                  <dd>Phone + app</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>71.5 × 147 mm</dd>
                </div>
                <div>
                  <dt>Scope</dt>
                  <dd>ID · CMF · UI/UX</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>

        <div className="disciplines">
          {disciplines.map((d) => (
            <article key={d.title} className={`discipline card${d.learning ? ' is-learning' : ''}`} data-reveal>
              <span className="discipline__icon">
                <FontAwesomeIcon icon={ICONS[d.icon]} />
              </span>
              <h3>
                {d.title}
                {d.learning && <span className="badge">learning</span>}
              </h3>
              <p>{d.text}</p>
              <ul className="tags">
                {d.tools.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <ol className="process" data-reveal>
          {process.map((p, i) => (
            <li key={p.step} style={{ '--i': i }}>
              <span className="process__n mono">0{i + 1}</span>
              <b>{p.step}</b>
              <span>{p.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Design
