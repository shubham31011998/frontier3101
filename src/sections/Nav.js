import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../hooks'
import { profile } from '../data/resume'

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'design', label: 'Design' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

const Nav = () => {
  const { theme, toggle } = useTheme()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      if (window.scrollY < window.innerHeight * 0.5) setActive('')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__logo" onClick={() => setOpen(false)} aria-label="Back to top">
          <span className="nav__mark">SY</span>
          <span className="nav__name">{profile.firstName}</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {SECTIONS.map(({ id, label }, i) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'is-active' : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="nav__idx">0{i + 1}</span>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            className="icon-btn"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </button>
          <a className="btn btn--small btn--ghost nav__resume" href={profile.resume} target="_blank" rel="noreferrer">
            Résumé
          </a>
          <button
            className="icon-btn nav__burger"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <FontAwesomeIcon icon={open ? faXmark : faBars} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Nav
