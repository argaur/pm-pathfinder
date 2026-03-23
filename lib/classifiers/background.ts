// ============================================================
// Background Axis Classifier
// Rule-based lookup — no AI. Maps (background role, industry)
// to one of three axes: technical | human_centered | business
// ============================================================

import { BackgroundAxis } from '@/lib/data/archetypes'

// Keyword → axis lookup (case-insensitive partial match)
const ROLE_KEYWORDS: Array<{ keywords: string[]; axis: BackgroundAxis }> = [
  // Technical
  {
    keywords: [
      'software engineer', 'software developer', 'swe', 'developer', 'programmer',
      'devops', 'sre', 'site reliability', 'infrastructure', 'backend', 'frontend',
      'fullstack', 'full stack', 'mobile developer', 'ios', 'android', 'qa engineer',
      'test engineer', 'automation engineer', 'tech lead', 'technical lead',
      'solution architect', 'solutions architect', 'staff engineer', 'principal engineer',
      'engineering manager', 'data engineer', 'ml engineer', 'machine learning',
      'data scientist', 'security engineer', 'network engineer',
    ],
    axis: 'technical',
  },
  // Human-Centered
  {
    keywords: [
      'designer', 'ux designer', 'product designer', 'ui designer', 'visual designer',
      'ux researcher', 'user researcher', 'research', 'content designer', 'content strategist',
      'customer success', 'customer support', 'support lead', 'cx specialist',
      'customer experience', 'implementation manager', 'account manager',
      'service designer', 'accessibility', 'usability',
    ],
    axis: 'human_centered',
  },
  // Business
  {
    keywords: [
      'business analyst', 'ba ', ' ba,', 'consultant', 'strategy', 'finance',
      'operations', 'ops manager', 'project manager', 'programme manager',
      'program manager', 'growth manager', 'growth lead', 'marketing',
      'business development', 'sales', 'account executive', 'pre-sales',
      'management consulting', 'analyst', 'category manager',
    ],
    axis: 'business',
  },
]

export function classifyBackground(
  backgroundRole: string,
  industry?: string
): BackgroundAxis {
  const haystack = `${backgroundRole} ${industry ?? ''}`.toLowerCase()

  // Score each axis by how many keywords match
  const scores: Record<BackgroundAxis, number> = {
    technical: 0,
    human_centered: 0,
    business: 0,
  }

  for (const { keywords, axis } of ROLE_KEYWORDS) {
    for (const kw of keywords) {
      if (haystack.includes(kw.toLowerCase())) {
        scores[axis] += 1
      }
    }
  }

  // Return the highest-scoring axis; default to 'business' if no match
  const maxScore = Math.max(...Object.values(scores))
  if (maxScore === 0) return 'business'

  return (Object.entries(scores).find(([, v]) => v === maxScore)?.[0] ??
    'business') as BackgroundAxis
}

// Background role options shown in the conversational onboarding UI
export const BACKGROUND_OPTIONS = [
  { value: 'Software Engineer / Developer', axis: 'technical' as BackgroundAxis },
  { value: 'Tech Lead / Engineering Manager', axis: 'technical' as BackgroundAxis },
  { value: 'Data Engineer / ML Engineer', axis: 'technical' as BackgroundAxis },
  { value: 'QA / DevOps / SRE', axis: 'technical' as BackgroundAxis },
  { value: 'UX / Product Designer', axis: 'human_centered' as BackgroundAxis },
  { value: 'UX Researcher', axis: 'human_centered' as BackgroundAxis },
  { value: 'Customer Success / Support Lead', axis: 'human_centered' as BackgroundAxis },
  { value: 'Business Analyst', axis: 'business' as BackgroundAxis },
  { value: 'Strategy / Management Consultant', axis: 'business' as BackgroundAxis },
  { value: 'Operations / Project Manager', axis: 'business' as BackgroundAxis },
  { value: 'Finance / Growth / Marketing', axis: 'business' as BackgroundAxis },
  { value: 'Other', axis: 'business' as BackgroundAxis },
]

export const INDUSTRY_OPTIONS = [
  'Fintech / Banking',
  'E-commerce / Retail',
  'SaaS / Enterprise Software',
  'Healthcare / Healthtech',
  'Edtech',
  'Gaming / Entertainment',
  'Consulting / Professional Services',
  'Logistics / Supply Chain',
  'Media / Content',
  'Other',
]
