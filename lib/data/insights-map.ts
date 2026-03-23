// ============================================================
// Skill-to-PM-Lingo Mapping
// Screen 3 (Early Insights): shows users that their existing
// skills already map to PM competencies
// ============================================================

import { BackgroundAxis } from './archetypes'

export interface InsightMapping {
  yourSkill: string
  pmCallsIt: string
  why: string
}

export const INSIGHTS_MAP: Record<BackgroundAxis, InsightMapping[]> = {
  technical: [
    {
      yourSkill: 'Triaging bugs by severity',
      pmCallsIt: 'Incident prioritisation',
      why: 'You already assess impact vs urgency — the core of PM prioritisation frameworks like RICE.',
    },
    {
      yourSkill: 'Writing acceptance criteria for tests',
      pmCallsIt: 'Defining product requirements',
      why: "You've been writing specs — PMs just call them user stories with acceptance criteria.",
    },
    {
      yourSkill: 'System and API design discussions',
      pmCallsIt: 'Technical architecture decisions',
      why: 'Your ability to think in interfaces and contracts is rare and highly valued in PM roles.',
    },
    {
      yourSkill: 'Code review and pull request feedback',
      pmCallsIt: 'Specification review and quality gates',
      why: 'You already know how to give structured, actionable feedback on work in progress.',
    },
    {
      yourSkill: 'On-call incident response',
      pmCallsIt: 'Operational risk management',
      why: 'You\'ve managed real-world system failures under pressure — PMs call this ops literacy.',
    },
    {
      yourSkill: 'Estimating story points and sprint capacity',
      pmCallsIt: 'Delivery planning and scope management',
      why: 'You understand the physics of shipping — something many PMs struggle to develop.',
    },
  ],
  human_centered: [
    {
      yourSkill: 'Mapping user flows and journey diagrams',
      pmCallsIt: 'Customer journey mapping',
      why: "You've been doing one of PM's most powerful discovery tools — just with a different name.",
    },
    {
      yourSkill: 'Conducting usability tests and user interviews',
      pmCallsIt: 'Qualitative user research',
      why: "This is a direct PM skill. You're already ahead of most career-switchers here.",
    },
    {
      yourSkill: 'Running design critiques and feedback sessions',
      pmCallsIt: 'Cross-functional alignment and feedback loops',
      why: 'Facilitating structured critique is a core PM skill for aligning teams without authority.',
    },
    {
      yourSkill: 'Building Figma prototypes to test ideas',
      pmCallsIt: 'Low-fidelity product validation',
      why: 'You already validate before building — the PM mantra. You just need to quantify the learnings.',
    },
    {
      yourSkill: 'Defining information architecture',
      pmCallsIt: 'Product taxonomy and navigation design',
      why: "IA decisions are product decisions. You've been making them all along.",
    },
    {
      yourSkill: 'Accessibility audits and inclusive design',
      pmCallsIt: 'Inclusive product design and edge case coverage',
      why: 'Thinking for diverse users is exactly the empathy muscle PMs need to develop.',
    },
  ],
  business: [
    {
      yourSkill: 'Building financial models in Excel',
      pmCallsIt: 'Business case development',
      why: 'You can quantify impact and build ROI arguments — a skill most technical PMs lack.',
    },
    {
      yourSkill: 'Presenting to senior stakeholders',
      pmCallsIt: 'Executive alignment and upward communication',
      why: 'PM success depends on getting buy-in without authority. You have a head start.',
    },
    {
      yourSkill: 'Market sizing and competitive analysis',
      pmCallsIt: 'Competitive landscape research',
      why: "You already know how to assess where a product fits in its market. That's strategic PM thinking.",
    },
    {
      yourSkill: 'KPI dashboards and performance reporting',
      pmCallsIt: 'North Star metric tracking and product analytics',
      why: 'Knowing which metrics matter — and how to move them — is the core PM analytics skill.',
    },
    {
      yourSkill: 'Scoping projects and writing requirements docs',
      pmCallsIt: 'Product requirements gathering and PRD writing',
      why: "You've been writing the early version of PRDs. The PM version just adds 'why' more explicitly.",
    },
    {
      yourSkill: 'Managing client expectations and timelines',
      pmCallsIt: 'Stakeholder management',
      why: "Managing expectation gaps across multiple parties is exactly what PMs do every day.",
    },
  ],
}

// Returns the top 3–4 most relevant insights for a given background axis
export function getInsightsForBackground(background: BackgroundAxis): InsightMapping[] {
  return INSIGHTS_MAP[background].slice(0, 4)
}
