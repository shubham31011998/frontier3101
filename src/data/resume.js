// Single source of truth for portfolio content (from Shubham's resume).

export const profile = {
  name: 'Shubham Yaduvanshi',
  firstName: 'Shubham',
  lastName: 'Yaduvanshi',
  role: 'AI Software Developer',
  location: 'Jaipur, Rajasthan',
  email: 'shubhamyaduvanshi03@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shubham-yaduvanshi-670432171/',
  github: 'https://github.com/shubham31011998',
  youtube: 'https://www.youtube.com/@rtxengineer',
  resume: '/Shubham-Yaduvanshi-Resume.pdf',
  summary:
    'Frontend Engineer with 4+ years of experience building scalable, high-performance web and mobile applications using React.js, Node.js, Next.js, .NET Core and modern JavaScript ecosystems. Specialized in modular architecture, responsive UI systems, performance optimization and AI automation workflow integration.',
}

export const roles = [
  'AI Software Developer',
  'Product Designer',
  'Frontend Engineer',
  'Creative Technologist',
  'Figma → React → Shipped',
]

export const stats = [
  { value: '4+', label: 'Years shipping production UI' },
  { value: '360°', label: 'Product design — digital & physical' },
  { value: '2', label: 'Enterprise domains: Insurance & Healthcare' },
  { value: 'AI', label: 'Features shipped, and always learning more' },
]

export const disciplines = [
  {
    title: 'Product Design',
    icon: 'compass',
    text: 'End-to-end: research, user flows, wireframes, high-fidelity UI and design systems that engineers love to build.',
    tools: ['Figma', 'Adobe XD', 'Design Systems'],
  },
  {
    title: 'UI / UX — Web & Apps',
    icon: 'mobile',
    text: 'Responsive web apps, PWAs and mobile screens, designed pixel-perfect and then built in React & React Native.',
    tools: ['Figma', 'React', 'React Native'],
  },
  {
    title: 'Physical Product & CMF',
    icon: 'cube',
    text: 'Industrial concepts, form studies and colour-material-finish exploration for real-world objects and packaging.',
    tools: ['Sketching', '3D', 'CMF'],
  },
  {
    title: 'Visual & Brand',
    icon: 'palette',
    text: 'Photo compositing, social creatives, thumbnails and identity work, with a strong eye for colour and type.',
    tools: ['Photoshop', 'Illustrator', 'Canva'],
  },
  {
    title: 'Motion & 3D for Web',
    icon: 'wand',
    text: 'Interactive WebGL, product configurators and micro-interactions that make interfaces feel alive.',
    tools: ['Three.js', 'R3F', 'CSS Motion'],
  },
  {
    title: 'AI-Assisted Design',
    icon: 'robot',
    text: 'Currently levelling up in AI: prompt-driven ideation, generative imagery, RAG and n8n automations.',
    tools: ['Prompting', 'RAG', 'n8n'],
    learning: true,
  },
]

export const process = [
  { step: 'Discover', text: 'Users, goals, constraints' },
  { step: 'Define', text: 'Flows & information architecture' },
  { step: 'Design', text: 'Wireframes → hi-fi in Figma' },
  { step: 'Prototype', text: 'Clickable & 3D prototypes' },
  { step: 'Build', text: 'Production React / .NET' },
  { step: 'Iterate', text: 'Measure, refine, repeat' },
]

export const experience = [
  {
    company: 'iCapital (Hexure)',
    role: 'Front End Engineer II',
    period: 'Dec 2024 — Present',
    location: 'Jaipur · Hybrid',
    product: 'FireLight — digital sales platform for insurance',
    highlights: [
      'Built AI-driven features — Common Tag suggestions and Rule Builder integrations — that raised system intelligence and user productivity.',
      'Built NIGO V2 end to end: carriers and distributors upload PDF annuity applications into FireLight, where agents annotate, e-sign and complete every requirement, turning offline paperwork into digital, in-good-order submissions.',
      'Delivered a CRUD application on .NET Core with scalable APIs and full data-lifecycle management.',
      'Drove the migration to the React-based New UI with reusable, scalable components.',
      'Hardened reliability: error handling, API integration flow, UI feedback, and cross-environment parity across Dev, QA, UAT and Prod.',
    ],
    spotlight: {
      name: 'NIGO V2',
      tagline: 'Paper-to-digital annuity applications, shipped in production',
      steps: [
        'Carrier / distributor uploads a PDF application',
        'PDF loads inside FireLight',
        'Agent annotates & places e-signatures',
        'Annuity requirements completed',
        'Digital, in-good-order submission',
      ],
    },
    tags: ['React', 'TypeScript', '.NET Core', 'AI features', 'PDF / e-sign', 'NIGO V2'],
  },
  {
    company: 'Ohum Healthcare Solutions',
    role: 'Technical Consultant (L1) · Lead UI Developer',
    period: 'Dec 2022 — Dec 2024',
    location: 'Jaipur',
    product: 'IHMS — Integrated Health Management System, Govt. of Rajasthan',
    highlights: [
      'Led frontend for the IHMS web and mobile app serving the Rajasthan Government.',
      'Built modular, responsive templates with modern CSS and JavaScript libraries.',
      'Mastered an in-house JavaScript framework and shipped 2 complete modules on it.',
      'Optimised the UI for laptop and tablet — the two primary clinical devices.',
      'Picked up React Native through company training and independently designed and built multiple mobile screens.',
    ],
    tags: ['JavaScript', 'SCSS', 'React Native', 'Responsive UI'],
  },
]

export const education = {
  degree: 'B.Tech — Electronics & Communication Engg.',
  school: 'Rajasthan Technical University, Kota',
  period: '2015 — 2021',
}

export const skillGroups = {
  Frontend: [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SCSS',
    'Tailwind CSS', 'Material UI', 'Bootstrap', 'jQuery', 'PWA', 'React Native',
  ],
  Backend: ['Node.js', '.NET Core', 'MongoDB', 'REST API', 'AJAX', 'JSON', 'MERN'],
  'Product Design': [
    'UI / UX', 'Wireframing', 'Prototyping', 'Design Systems', 'Physical Product', 'CMF', 'Branding', 'Motion',
  ],
  'AI · learning': ['RAG', 'Prompt Eng.', 'LLM Agents', 'n8n', 'GitHub Copilot', 'ChatGPT'],
  Tools: [
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Canva', 'Blender', 'Three.js', 'Git', 'Bitbucket', 'JIRA',
    'VS Code',
  ],
}

export const projects = [
  {
    name: 'SubscribeMyAI',
    blurb: 'A platform where content creators build their own AI agent and monetize it with subscriptions.',
    tags: ['Next.js', 'AI Agents', 'Payments'],
    url: 'https://subscribemyai.vercel.app/login',
    hue: 265,
    featured: true,
  },
  {
    name: 'Cryptoverse',
    blurb: 'Live crypto prices in USD with coin-specific news feeds and market stats.',
    tags: ['React', 'Redux Toolkit', 'REST'],
    url: 'https://cryptoverse123.netlify.app/',
    hue: 190,
  },
  {
    name: 'Xpense Tracker',
    blurb: 'An advanced expense tracker — add, delete and search every expense in seconds.',
    tags: ['React', 'State', 'UX'],
    url: 'https://xpense-tracker123.netlify.app/',
    hue: 140,
  },
  {
    name: 'Utube',
    blurb: 'A YouTube clone powered by the YouTube Data API with search, channels and playback.',
    tags: ['React', 'Axios', 'YouTube API'],
    url: 'https://utube123.netlify.app/',
    hue: 0,
  },
]
