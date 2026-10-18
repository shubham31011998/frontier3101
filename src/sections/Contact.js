import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faCheck, faLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { profile } from '../data/resume'

const Contact = () => {
  const form = useRef()
  const [status, setStatus] = useState('idle')
  const [copied, setCopied] = useState(false)

  const sendEmail = (e) => {
    e.preventDefault()
    setStatus('sending')
    emailjs.sendForm('service_i4ue2rt', 'template_6wndgab', form.current, 'z_dBL_XjW-IkbURRr').then(
      () => {
        setStatus('sent')
        form.current.reset()
      },
      () => setStatus('error')
    )
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="container contact__grid">
        <div className="contact__copy" data-reveal>
          <p className="eyebrow">06 — Contact</p>
          <h2 className="section__title contact__title">
            Let's build something that feels <span className="grad">alive</span>.
          </h2>
          <p className="lead">
            Hiring for a frontend, product-design or AI-focused role, or have an ambitious product in mind? My inbox is open.
          </p>

          <button className="email-chip card" onClick={copyEmail}>
            <span className="mono">{profile.email}</span>
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
            <span className="sr-only" aria-live="polite">
              {copied ? 'Email copied' : ''}
            </span>
          </button>

          <ul className="contact__meta">
            <li>
              <FontAwesomeIcon icon={faLocationDot} /> {profile.location}, India
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faLinkedinIn} /> LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faGithub} /> GitHub
              </a>
            </li>
          </ul>
        </div>

        <form ref={form} onSubmit={sendEmail} className="contact__form card card--glass" data-reveal>
          <div className="field-row">
            <label className="field">
              <span>Name</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
          </div>
          <label className="field">
            <span>Subject</span>
            <input type="text" name="subject" required />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea name="message" rows="5" required />
          </label>
          <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'} <FontAwesomeIcon icon={faPaperPlane} />
          </button>
          <p className={`form-status form-status--${status}`} role="status">
            {status === 'sent' && "Thanks! Your message is on its way. I'll reply soon."}
            {status === 'error' && 'Something went wrong. Please email me directly.'}
          </p>
        </form>
      </div>
    </section>
  )
}

export default Contact
