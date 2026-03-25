import { Dimension } from '@/lib/data/questions'

export const ROLE_THRESHOLDS = [
  {
    role: 'APM / Associate PM',
    min: 55,
    description: 'Entry-level PM roles, often at large tech companies',
    requiredSkills: ['Product Sense', 'User Empathy', 'Basic Prioritisation', 'Stakeholder Communication'],
    dimensionFocus: ['thinking_strategy', 'user_research', 'communication'] as Dimension[],
    unlocksAt: 0,
  },
  {
    role: 'Product Manager (IC)',
    min: 70,
    description: 'Core PM roles — 2–5 years experience expected',
    requiredSkills: ['Execution & Delivery', 'Technical Fluency', 'Roadmap Ownership', 'Metrics & KPIs', 'Strategic Thinking'],
    dimensionFocus: ['execution', 'technical_fluency', 'thinking_strategy'] as Dimension[],
    unlocksAt: 55,
  },
  {
    role: 'Senior PM',
    min: 82,
    description: 'Senior IC or Lead roles — strong track record required',
    requiredSkills: ['Cross-functional Leadership', 'P&L Awareness', 'Team Mentorship', 'Advanced Strategy', 'Stakeholder Influence'],
    dimensionFocus: ['communication', 'thinking_strategy', 'execution'] as Dimension[],
    unlocksAt: 70,
  },
]
