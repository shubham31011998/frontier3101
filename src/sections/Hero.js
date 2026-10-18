import { lazy, Suspense, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { profile, roles as ROLES } from '../data/resume'
import { useReducedMotion } from '../hooks'

const HeroScene = lazy(() => import('../three/HeroScene'))

// Types and deletes each role in turn.
const useTypewriter = (words, reduced) => {
  const [text, setText] = useState(reduced ? words[0] : '')
  useEffect(() => {
    if (reduced) return
    let word = 0
    let len = 0
    let deleting = false
    let timer
    const tick = () => {
      const w = words[word]
      len += deleting ? -1 : 1
      setText(w.slice(0, len))
      let delay = deleting ? 35 : 70
      if (!deleting && len === w.length) {
        deleting = true
        delay = 1800
      } else if (deleting && len === 0) {
        deleting = false
        word = (word + 1) % words.length
        delay = 300
      }
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [words, reduced])
  return text
}

const Hero = () => {
  const reduced = useReducedMotion()
  const role = useTypewriter(ROLES, reduced)

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="blob blob--a" />
        <div className="blob blob--b" />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow hero__status">
            <span className="pulse-dot" /> Open to new opportunities · {profile.location}
          </p>
          <h1 className="hero__title">
            <span className="hero__line">{profile.firstName}</span>
            <span className="hero__line hero__line--outline">{profile.lastName}</span>
          </h1>
          <p className="hero__role mono">
            <span className="hero__caret-prefix">&gt;</span> {role}
            <span className="caret" aria-hidden="true" />
          </p>
          <p className="hero__lead">
            I <strong>design</strong> and <strong>build</strong> products end to end, from Figma frames and
            physical-product concepts to production React apps for enterprise insurance and healthcare. Now levelling
            up in <strong>AI</strong>.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#work">
              See my work <FontAwesomeIcon icon={faArrowRight} />
            </a>
            <a className="btn btn--ghost" href="#contact">
              Let's talk
            </a>
            <div className="socials">
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href={profile.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <Suspense fallback={<div className="orb-fallback" aria-hidden="true" />}>
            <HeroScene className="hero__canvas" />
          </Suspense>
          <p className="hint mono" aria-hidden="true">
            ✦ click the core · move your cursor
          </p>
        </div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to About">
        <FontAwesomeIcon icon={faArrowDown} />
      </a>
    </section>
  )
}

export default Hero
