const ROW_A = ['Product Design', 'UI / UX', 'React', 'Figma', 'Physical Product', 'Photoshop', 'Three.js', 'Next.js']
const ROW_B = ['Design Systems', 'CMF', 'Prototyping', '.NET Core', 'Branding', 'Motion', 'AI Workflows', 'React Native']

const Row = ({ items, reverse }) => (
  <div className={`marquee__row${reverse ? ' is-reverse' : ''}`}>
    {/* Content is duplicated so the loop is seamless. */}
    {[0, 1].map((copy) => (
      <div className="marquee__track" key={copy} aria-hidden={copy === 1}>
        {items.map((t) => (
          <span key={t}>
            {t}
            <i>✦</i>
          </span>
        ))}
      </div>
    ))}
  </div>
)

const Marquee = () => (
  <div className="marquee" role="presentation">
    <Row items={ROW_A} />
    <Row items={ROW_B} reverse />
  </div>
)

export default Marquee
