import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Nav, { SECTIONS } from './sections/Nav'
import Hero from './sections/Hero'
import Marquee from './sections/Marquee'
import About from './sections/About'
import Design from './sections/Design'
import Experience from './sections/Experience'
import Cursor from './sections/Cursor'
import Progress from './sections/Progress'
import Skills from './sections/Skills'
import Work from './sections/Work'
import Contact from './sections/Contact'
import { ThemeContext, useRevealAll, useThemeState } from './hooks'
import { profile } from './data/resume'
import './styles/main.scss'
import './styles/_studio.scss'

// Old multi-page routes (/about, /portfolio, /contact) map onto sections.
const LEGACY_ROUTES = { portfolio: 'work' }

function App() {
  const themeState = useThemeState()
  const { pathname } = useLocation()
  useRevealAll()

  // Disable the context menu, except in form fields so pasting still works.
  useEffect(() => {
    const block = (e) => {
      if (!e.target.closest?.('input, textarea')) e.preventDefault()
    }
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [])

  useEffect(() => {
    const slug = pathname.replace(/^\/+|\/+$/g, '')
    const id = LEGACY_ROUTES[slug] || slug
    if (SECTIONS.some((s) => s.id === id)) {
      document.getElementById(id)?.scrollIntoView()
    }
  }, [pathname])

  return (
    <ThemeContext.Provider value={themeState}>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Cursor />
      <Progress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Design />
        <Experience />
        <Skills />
        <Work />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container footer__inner">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="mono">Built with React · Three.js · R3F</p>
        </div>
      </footer>
    </ThemeContext.Provider>
  )
}

export default App
