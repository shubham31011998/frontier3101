import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import LogoTitle from '../../assets/images/logo-s.png'
import './index.scss'

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  const nameArray = ['h', 'u', 'b', 'h', 'a', 'm',' ','Y','a','d','u','v','a','n','s','h','i']
  const jobArray = [
    'w',
    'e',
    'b',
    ' ',
    'd',
    'e',
    'v',
    'e',
    'l',
    'o',
    'p',
    'e',
    'r',
    '.',
  ]

  useEffect(() => {
    return setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 4000)
  }, [])

  return (
    <>
      <div className="container home-page">
        <div className="text-zone">
          <h1>
            <span className={letterClass}>H</span>
            <span className={`${letterClass} _12`}>i,</span>
            <br />
            <span className={`${letterClass} _13`}>I</span>
            <span className={`${letterClass} _14`}>'m</span>
            <img
              src={LogoTitle}
              alt="JavaScript Developer Name, Web Developer Name"
            />
            <AnimatedLetters
              letterClass={letterClass}
              strArray={nameArray}
              idx={15}
            />
            <br />
            <AnimatedLetters
              letterClass={letterClass}
              strArray={jobArray}
              idx={22}
            />
          </h1>
          <h2>A Frontend Developer who crafts beautiful, interactive, and performance-driven websites using <b>React</b>, <b>JavaScript</b>, <b>CSS</b>, and more.</h2>
          <ul>
            <li>
              <h2>🔧 5+ years of hands-on experience</h2>  
            </li>
            <li>
              <h2>🎮 Gamer at heart — Checkout my [<a className="greenTxt" rel="noreferrer" href='https://www.youtube.com/@rtxengineer' target='_blank'>YouTube Channel</a>]</h2>  
            </li>
            <li>
              <h2>🎯 Always learning — exploring the newest web dev trends and tech</h2>  
            </li>
          </ul>
            
          <Link to="/contact" className="flat-button">
            CONTACT ME
          </Link>
        </div>
        {/* <Logo /> */}
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Home
