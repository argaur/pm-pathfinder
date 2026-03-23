// ============================================================
// Diagnostic Questions — 10 MCQs, 2 per dimension
// Each option scores 0–3 on its primary dimension
// ============================================================

export type Dimension =
  | 'thinking_strategy'
  | 'execution'
  | 'technical_fluency'
  | 'user_research'
  | 'communication'

export interface QuestionOption {
  id: string
  text: string
  scores: Partial<Record<Dimension, number>>
}

export interface DiagnosticQuestion {
  id: string
  dimension: Dimension
  chunk: number // 1–4 (questions served in chunks of 3)
  text: string
  options: QuestionOption[]
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // ─── Chunk 1: Thinking & Strategy ───────────────────────
  {
    id: 'q1',
    dimension: 'thinking_strategy',
    chunk: 1,
    text: 'Your team has 5 features requested by 3 different stakeholders, all marked "urgent". What do you do first?',
    options: [
      { id: 'a', text: 'Ask each stakeholder to provide a business justification before committing', scores: { thinking_strategy: 3 } },
      { id: 'b', text: 'Build a prioritisation matrix scoring each feature on impact vs effort', scores: { thinking_strategy: 2 } },
      { id: 'c', text: 'Ship the quickest ones first to show momentum', scores: { thinking_strategy: 1 } },
      { id: 'd', text: 'Escalate to your manager to decide', scores: { thinking_strategy: 0 } },
    ],
  },
  {
    id: 'q2',
    dimension: 'thinking_strategy',
    chunk: 1,
    text: 'A competitor launches a feature your team was building. How do you respond?',
    options: [
      { id: 'a', text: 'Pause and re-evaluate whether the problem is still worth solving for your users', scores: { thinking_strategy: 3 } },
      { id: 'b', text: 'Run user research to understand if the competitor\'s version actually solves the problem', scores: { thinking_strategy: 2 } },
      { id: 'c', text: 'Accelerate your build and ship faster to compete', scores: { thinking_strategy: 1 } },
      { id: 'd', text: 'Shift focus to a completely different feature area', scores: { thinking_strategy: 0 } },
    ],
  },

  // ─── Chunk 2: Execution ─────────────────────────────────
  {
    id: 'q3',
    dimension: 'execution',
    chunk: 2,
    text: "You're 2 weeks from a deadline and a critical engineer just resigned. What do you do?",
    options: [
      { id: 'a', text: 'Reduce scope to preserve the deadline — identify the minimum shippable slice', scores: { execution: 3 } },
      { id: 'b', text: 'Push the deadline and communicate clearly to stakeholders with a revised plan', scores: { execution: 2 } },
      { id: 'c', text: 'Request additional engineering resources immediately', scores: { execution: 1 } },
      { id: 'd', text: 'Work nights to compensate for the lost capacity', scores: { execution: 0 } },
    ],
  },
  {
    id: 'q4',
    dimension: 'execution',
    chunk: 2,
    text: 'A sprint is ending and 3 stories are at 80% done. What do you tell stakeholders?',
    options: [
      { id: 'a', text: '3 stories will slip — here\'s exactly why and here\'s the revised timeline', scores: { execution: 3 } },
      { id: 'b', text: 'Partially ship what\'s ready and flag the remaining 20% as a follow-up', scores: { execution: 2 } },
      { id: 'c', text: 'Stories are "in progress" — nothing to report until they\'re done', scores: { execution: 1 } },
      { id: 'd', text: 'The sprint was successful overall — these are minor overruns', scores: { execution: 0 } },
    ],
  },

  // ─── Chunk 3: Technical Fluency ─────────────────────────
  {
    id: 'q5',
    dimension: 'technical_fluency',
    chunk: 3,
    text: 'Your engineer says "this feature would require a schema migration and could affect latency". What do you do?',
    options: [
      { id: 'a', text: 'Ask them to walk you through the tradeoffs and propose a phased implementation approach', scores: { technical_fluency: 3 } },
      { id: 'b', text: 'Ask another engineer for a second opinion on the risk', scores: { technical_fluency: 2 } },
      { id: 'c', text: 'Trust their judgement and delay the feature to the next cycle', scores: { technical_fluency: 1 } },
      { id: 'd', text: 'Technical risk is the engineering team\'s domain — deprioritise and move on', scores: { technical_fluency: 0 } },
    ],
  },
  {
    id: 'q6',
    dimension: 'technical_fluency',
    chunk: 3,
    text: "How would you validate a third-party API integration before committing to it in your roadmap?",
    options: [
      { id: 'a', text: 'Ask engineering to run a time-boxed proof-of-concept spike before committing', scores: { technical_fluency: 3 } },
      { id: 'b', text: 'Check if reputable competitors are using the same API as a signal of reliability', scores: { technical_fluency: 2 } },
      { id: 'c', text: 'Read their documentation thoroughly and trust the claims', scores: { technical_fluency: 1 } },
      { id: 'd', text: 'Commit to it and handle any issues once they arise in development', scores: { technical_fluency: 0 } },
    ],
  },

  // ─── Chunk 4: User & Research ───────────────────────────
  {
    id: 'q7',
    dimension: 'user_research',
    chunk: 4,
    text: "You have 2 days before launch. A user interview surfaces a concern about your core onboarding flow. What do you do?",
    options: [
      { id: 'a', text: 'Quickly run 2–3 more sessions to validate the severity before deciding', scores: { user_research: 3 } },
      { id: 'b', text: 'Acknowledge it but proceed — one interview is not statistically significant', scores: { user_research: 2 } },
      { id: 'c', text: 'Delay the launch to investigate and fix the issue', scores: { user_research: 1 } },
      { id: 'd', text: 'Log it as a post-launch backlog item and proceed', scores: { user_research: 0 } },
    ],
  },
  {
    id: 'q8',
    dimension: 'user_research',
    chunk: 4,
    text: 'Your NPS drops 15 points in the week after a feature launch. What is your first step?',
    options: [
      { id: 'a', text: 'Segment the detractors by cohort and read their verbatim comments for patterns', scores: { user_research: 3 } },
      { id: 'b', text: 'Run a targeted survey to understand the specific reasons behind the drop', scores: { user_research: 2 } },
      { id: 'c', text: 'Roll back the feature immediately to stop the bleeding', scores: { user_research: 1 } },
      { id: 'd', text: 'Wait 3–4 weeks to see if the score naturally recovers', scores: { user_research: 0 } },
    ],
  },

  // ─── Chunk 4 (cont): Communication ──────────────────────
  {
    id: 'q9',
    dimension: 'communication',
    chunk: 4,
    text: 'You need buy-in from a skeptical VP on your roadmap. How do you structure the meeting?',
    options: [
      { id: 'a', text: 'Lead with the business outcome, then the problem, then your proposed solution', scores: { communication: 3 } },
      { id: 'b', text: 'Send a pre-read deck 24 hours before to prime them on the context', scores: { communication: 2 } },
      { id: 'c', text: 'Present the full roadmap with every supporting data point so nothing is missed', scores: { communication: 1 } },
      { id: 'd', text: 'Ask a senior ally to champion the roadmap on your behalf', scores: { communication: 0 } },
    ],
  },
  {
    id: 'q10',
    dimension: 'communication',
    chunk: 4,
    text: 'Your engineer and designer are visibly disagreeing on a solution during a client meeting. What do you do?',
    options: [
      { id: 'a', text: 'Table the discussion: "Let\'s take this offline — I\'ll share a decision before end of day"', scores: { communication: 3 } },
      { id: 'b', text: 'Redirect the room: "Let\'s align on the problem first, then the solution"', scores: { communication: 2 } },
      { id: 'c', text: 'Side with whoever presents the stronger argument in the moment', scores: { communication: 1 } },
      { id: 'd', text: 'Let them debate until they reach natural consensus', scores: { communication: 0 } },
    ],
  },
]

// Questions per chunk for progressive rendering
export const CHUNK_LABELS: Record<number, string> = {
  1: 'Thinking & Strategy',
  2: 'Execution',
  3: 'Technical Fluency',
  4: 'User Research & Communication',
}

export const TOTAL_QUESTIONS = DIAGNOSTIC_QUESTIONS.length
