import { lazy, Suspense } from 'react'
import { experience } from '../data/resume'

const LaptopScene = lazy(() => import('../three/LaptopScene'))

const Experience = () => (
  <section className="section experience" id="experience">
    <div className="container">
      <header className="section__head" data-reveal>
        <p className="eyebrow">03 — Experience</p>
        <h2 className="section__title">
          Where I've been <span className="grad">shipping</span>.
        </h2>
      </header>

      <div className="experience__grid">
        <div className="experience__stage card card--glass" data-reveal>
          <Suspense fallback={<div className="stage-fallback" />}>
            <LaptopScene className="experience__canvas" />
          </Suspense>
          <p className="hint mono">drag to rotate · click to open / close</p>
        </div>

        <ol className="timeline">
          {experience.map((job) => (
            <li className="timeline__item" key={job.company} data-reveal>
              <span className="timeline__dot" aria-hidden="true" />
              <article className="job card card--glass">
                <div className="job__top">
                  <div>
                    <h3 className="job__company">{job.company}</h3>
                    <p className="job__role">{job.role}</p>
                  </div>
                  <div className="job__when mono">
                    <span>{job.period}</span>
                    <span className="job__where">{job.location}</span>
                  </div>
                </div>
                <p className="job__product">{job.product}</p>
                {job.spotlight && (
                  <div className="spotlight">
                    <p className="spotlight__head">
                      <span className="spotlight__name">{job.spotlight.name}</span>
                      <span className="spotlight__tag">{job.spotlight.tagline}</span>
                    </p>
                    <ol className="spotlight__flow">
                      {job.spotlight.steps.map((s, i) => (
                        <li key={s} style={{ '--i': i }}>
                          <span className="mono">0{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                <ul className="job__list">
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <ul className="tags">
                  {job.tags.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
)

export default Experience
