// ============================================================
// PM Archetype definitions
// 2-axis model: Background (Technical/Human-Centered/Business)
//               × Mindset (Execution/Strategy)
// ============================================================

export type ArchetypeId =
  | 'builder'
  | 'architect'
  | 'storyteller'
  | 'advocate'
  | 'operator'
  | 'strategist'

export type BackgroundAxis = 'technical' | 'human_centered' | 'business'
export type MindsetAxis = 'execution' | 'strategy'

export interface Archetype {
  id: ArchetypeId
  name: string
  tagline: string
  description: string
  background: BackgroundAxis
  mindset: MindsetAxis
  comesFrom: string[]
  traits: string[]
  strengths: string[]
  growthAreas: string[]
  color: string       // Tailwind color token
  accentColor: string // hex for charts
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  builder: {
    id: 'builder',
    name: 'The Builder',
    tagline: 'You ship things. Now learn to ship the right things.',
    description:
      'You think in systems and solutions. Your instinct is to fix problems with code or process. As a PM, your edge is credibility with engineers and a zero-tolerance for vague requirements.',
    background: 'technical',
    mindset: 'execution',
    comesFrom: ['Software Engineer', 'DevOps', 'QA Engineer', 'Technical Lead'],
    traits: ['Systems Thinker', 'Execution-First', 'Detail-Oriented'],
    strengths: [
      'Deep credibility with engineering teams',
      'Can write precise, unambiguous specs',
      'Strong at scoping and risk identification',
    ],
    growthAreas: [
      'User empathy and qualitative research',
      'Stakeholder storytelling and narrative',
      'Long-horizon strategic thinking',
    ],
    color: 'blue',
    accentColor: '#3b82f6',
  },
  architect: {
    id: 'architect',
    name: 'The Architect',
    tagline: 'You see the whole system. Now connect it to the business.',
    description:
      'You zoom out instinctively. You\'re comfortable with ambiguity and can map technical constraints to product decisions. Your edge is connecting engineering reality to product strategy.',
    background: 'technical',
    mindset: 'strategy',
    comesFrom: ['Tech Lead', 'Solution Architect', 'Staff Engineer', 'Engineering Manager'],
    traits: ['Strategic Thinker', 'Systems Designer', 'Data-Driven'],
    strengths: [
      'Can translate technical complexity into product strategy',
      'Strong at platform and API product thinking',
      'Excellent at build vs buy vs partner decisions',
    ],
    growthAreas: [
      'Customer-facing communication and storytelling',
      'Qualitative research and user empathy',
      'Driving cross-functional alignment without authority',
    ],
    color: 'indigo',
    accentColor: '#6366f1',
  },
  storyteller: {
    id: 'storyteller',
    name: 'The Storyteller',
    tagline: 'You understand people. Now learn to prioritise ruthlessly.',
    description:
      'You lead with empathy and have a natural gift for narrative. You understand user needs before they\'re articulated. Your edge is building products people love — your challenge is turning insights into decisions.',
    background: 'human_centered',
    mindset: 'strategy',
    comesFrom: ['UX Designer', 'Product Designer', 'UX Researcher', 'Content Strategist'],
    traits: ['Empathy-Led', 'Narrative Thinker', 'Vision-Oriented'],
    strengths: [
      'Deep user empathy and research fluency',
      'Outstanding product vision and positioning',
      'Excellent at qualitative synthesis and insight generation',
    ],
    growthAreas: [
      'Data analysis and quantitative decision-making',
      'Technical understanding and engineering partnership',
      'Ruthless prioritisation under resource constraints',
    ],
    color: 'violet',
    accentColor: '#8b5cf6',
  },
  advocate: {
    id: 'advocate',
    name: 'The Advocate',
    tagline: 'You fight for the user. Now build the systems to serve them at scale.',
    description:
      'You\'ve seen customers struggle firsthand and you\'re wired to fix it. You combine empathy with a strong bias for action. Your edge is deep domain knowledge of real user pain; your challenge is scaling that instinct into structured product decisions.',
    background: 'human_centered',
    mindset: 'execution',
    comesFrom: ['Customer Success', 'Support Lead', 'CX Specialist', 'Implementation Manager'],
    traits: ['User Champion', 'Problem Solver', 'Action-Oriented'],
    strengths: [
      'Unparalleled knowledge of real user pain points',
      'Strong at requirements gathering from customer feedback',
      'Credible voice-of-customer in internal discussions',
    ],
    growthAreas: [
      'Strategic prioritisation beyond individual user requests',
      'Technical fluency to partner effectively with engineering',
      'Market and competitive analysis skills',
    ],
    color: 'pink',
    accentColor: '#ec4899',
  },
  operator: {
    id: 'operator',
    name: 'The Operator',
    tagline: 'You make things run. Now make the right things run.',
    description:
      'You\'re process-oriented, metrics-driven, and allergic to waste. You deliver. As a PM, your edge is rigour and cross-functional coordination. Your challenge is shifting from optimising existing systems to imagining entirely new ones.',
    background: 'business',
    mindset: 'execution',
    comesFrom: ['Business Analyst', 'Operations Manager', 'Consultant', 'Project Manager'],
    traits: ['Process-Driven', 'Metrics-Focused', 'Cross-Functional'],
    strengths: [
      'Exceptional at scoping, planning and delivery tracking',
      'Strong stakeholder management and communication',
      'Natural ability to define and track success metrics',
    ],
    growthAreas: [
      'Creative problem-solving beyond process optimisation',
      'Technical literacy for engineering conversations',
      'User research and qualitative insight generation',
    ],
    color: 'amber',
    accentColor: '#f59e0b',
  },
  strategist: {
    id: 'strategist',
    name: 'The Strategist',
    tagline: 'You see the market. Now translate it into a product that ships.',
    description:
      'You think in competitive landscapes, business models, and long-term bets. You\'re comfortable with ambiguity and can connect dots across functions. Your edge is business acumen; your challenge is grounding strategy in what users actually need.',
    background: 'business',
    mindset: 'strategy',
    comesFrom: ['Strategy Consultant', 'Finance', 'Growth Manager', 'Business Development'],
    traits: ['Business-Minded', 'Market-Oriented', 'Long-Horizon Thinker'],
    strengths: [
      'Strong at business case development and ROI framing',
      'Excellent at competitive and market analysis',
      'Natural at executive alignment and C-suite communication',
    ],
    growthAreas: [
      'User empathy and qualitative research methods',
      'Technical fluency for engineering partnership',
      'Translating strategy into executable sprint-level work',
    ],
    color: 'emerald',
    accentColor: '#10b981',
  },
}

// 2-axis lookup: [background][mindset] → archetype
export const ARCHETYPE_MATRIX: Record<BackgroundAxis, Record<MindsetAxis, ArchetypeId>> = {
  technical: {
    execution: 'builder',
    strategy: 'architect',
  },
  human_centered: {
    execution: 'advocate',
    strategy: 'storyteller',
  },
  business: {
    execution: 'operator',
    strategy: 'strategist',
  },
}
