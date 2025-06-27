import { useEffect, useState } from 'react'
import {
  faAngular,
  faCss3,
  faGitAlt,
  faHtml5,
  faJsSquare,
  faReact,
} from '@fortawesome/free-brands-svg-icons'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss'

const About = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    return setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)
  }, [])

  return (
    <>
      <div className="container about-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['A', 'b', 'o', 'u', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>
          <p>
            Passionate Frontend Developer, Designer & Tech Explorer I'm Shubham, a frontend web developer with 5+ years of experience building engaging user interfaces using <b>React.js</b>, <b>JavaScript</b>, <b>HTML</b>, and <b>CSS</b>. I combine clean code with creative design to build user-friendly, responsive, and scalable websites and apps.
          </p>
          <p align="LEFT">
            With hands-on experience in <b>React Native</b>, <b>Figma</b>, <b>Photoshop</b>, and <b>CSS animations</b>, I bring ideas to life — pixel by pixel.<br></br>I also run a gaming YouTube channel, [<a className="greenTxt" href='https://www.youtube.com/@rtxengineer' target='_blank'>RTX Engineer (Gaming Channel)</a>], where I share gameplay, tech insights, and more.
          </p>
          <p>
            When I'm not coding or gaming, I’m usually exploring new tools, frameworks, and development tricks to stay sharp and ahead of the curve.
          </p>
        </div>

        <div className="stage-cube-cont">
          <div className="cubespinner">
            <div className="face1">
              <FontAwesomeIcon icon={faAngular} color="#DD0031" />
            </div>
            <div className="face2">
              <FontAwesomeIcon icon={faHtml5} color="#F06529" />
            </div>
            <div className="face3">
              <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
            </div>
            <div className="face4">
              <FontAwesomeIcon icon={faReact} color="#5ED4F4" />
            </div>
            <div className="face5">
              <FontAwesomeIcon icon={faJsSquare} color="#EFD81D" />
            </div>
            <div className="face6">
              <FontAwesomeIcon icon={faGitAlt} color="#EC4D28" />
            </div>
          </div>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default About
