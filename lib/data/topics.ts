import { Dimension } from '@/lib/data/questions'

export interface TopicContent {
  slug: string
  title: string
  dimension: Dimension
  tagline: string
  concept: string
  framework: string[]   // blurred — coming soon
  exercise: string      // blurred — coming soon
  videoId: string
}

export const TOPICS: TopicContent[] = [
  // ── thinking_strategy ─────────────────────────────────────────────────────
  {
    slug: 'prioritisation',
    title: 'Prioritisation',
    dimension: 'thinking_strategy',
    tagline: 'Deciding what matters most — and defending it.',
    concept: 'Prioritisation is the core PM skill that separates noise from signal. Great PMs don\'t just score features — they balance data signals, strategic bets, and stakeholder context simultaneously. The credibility you build through transparent, consistent prioritisation is what earns you autonomy on the roadmap.',
    framework: [
      'RICE scoring: Reach × Impact × Confidence ÷ Effort — use it to force explicit tradeoffs',
      'The Opportunity Solution Tree: link outcomes → opportunities → solutions before scoring',
      'Stack-rank forcing: no ties allowed; every item must beat another in at least one dimension',
      'Threshold criteria: define what makes something unshippable before the debate starts',
    ],
    exercise: 'You have 3 features requested by leadership, 2 by engineering, and 1 critical bug. Your sprint capacity is 80 points. Walk through how you\'d prioritise and what you\'d cut — and how you\'d communicate the decision to each stakeholder group.',
    videoId: 'VBfJayYLSkE',
  },
  {
    slug: 'problem-framing',
    title: 'Problem Framing',
    dimension: 'thinking_strategy',
    tagline: 'The right problem is half the solution.',
    concept: 'Ambiguous briefs are one of the most common PM challenges. Before jumping to solutions, the highest-leverage thing a PM can do is define the problem space clearly. Strong problem framing turns a vague ask into a shared understanding of what success looks like — and earns trust by bringing clarity where others bring opinions.',
    framework: [
      '5 Whys: iteratively ask why to separate symptoms from root causes',
      'Job-to-be-Done framing: "When _____, I want to _____, so I can _____"',
      'Problem statement template: who, what, where, when, why — eliminate assumptions',
      'Reframe test: can you state the problem 3 different ways? If not, you don\'t understand it yet',
    ],
    exercise: 'A VP says "users are dropping off on the checkout page, we need a redesign." How do you reframe this into a proper problem statement? What questions do you ask before agreeing to scope a solution?',
    videoId: 'U8a-oJf0cWc',
  },
  {
    slug: 'trade-off-decisions',
    title: 'Trade-off Decisions',
    dimension: 'thinking_strategy',
    tagline: 'Where PM judgment becomes visible.',
    concept: 'Every roadmap decision is a trade-off — between speed and quality, breadth and depth, short-term and long-term. The best PMs don\'t avoid trade-offs, they make them explicit and time-boxed. Defining a minimum quality bar, shipping, and iterating is the pattern that compounds faster than waiting for perfect.',
    framework: [
      'Define the non-negotiables first: what is the minimum bar to ship safely?',
      'Time-box the debate: if you can\'t decide in 30 mins, you\'re missing information',
      'Document the decision with rationale — future-you will thank present-you',
      'Set a revisit date: trade-offs aren\'t permanent, but decisions need commitment',
    ],
    exercise: 'Engineering estimates a feature at 6 weeks. You have a launch date in 4 weeks. Walk through how you\'d make and communicate the trade-off decision — what do you cut, what do you defer, and how do you maintain quality bar?',
    videoId: 'tSxiS_NX68M',
  },

  // ── execution ─────────────────────────────────────────────────────────────
  {
    slug: 'sprint-planning',
    title: 'Sprint Planning',
    dimension: 'execution',
    tagline: 'Goal-first planning keeps teams focused on outcomes.',
    concept: 'Sprint planning is where strategy meets execution. The highest-impact change most PMs can make is shifting from story-first to goal-first planning. When the team aligns on what the sprint should achieve before touching the backlog, mid-sprint chaos drops significantly — because everyone has a north star for making tradeoff calls themselves.',
    framework: [
      'Set the sprint goal in one sentence before opening the backlog',
      'Story selection test: "Does this story directly serve the sprint goal?" If not, defer it',
      'Capacity buffer: reserve 10–15% for unplanned work — it always exists',
      'Definition of Done: agree on what "done" means before the sprint starts, not after',
    ],
    exercise: 'You\'re planning a sprint aimed at "reduce checkout friction." You have 12 stories in the ready backlog and capacity for 8. Walk through how you\'d select stories and what you\'d push to the next sprint.',
    videoId: 'GVExvt4A2rs',
  },
  {
    slug: 'stakeholder-alignment',
    title: 'Stakeholder Alignment',
    dimension: 'execution',
    tagline: 'How you respond to change defines whether stakeholders trust your process.',
    concept: 'Stakeholder alignment isn\'t a one-time event — it\'s an ongoing operating model. The best PMs build a rhythm of communication that makes stakeholders feel informed without being overwhelmed. How you handle mid-sprint change requests is particularly revealing: protect the sprint integrity while making the stakeholder feel genuinely heard.',
    framework: [
      'RACI per workstream: who is Responsible, Accountable, Consulted, Informed',
      'Change request protocol: log it → assess impact → route it to right cycle',
      'Pre-read culture: share context 24h before decisions, not in the meeting',
      'Alignment check-ins: 5-min async update beats a 30-min sync for most stakeholders',
    ],
    exercise: 'A senior stakeholder sends you a Slack message mid-sprint asking to swap a story for a new high-priority feature. How do you respond? Walk through your exact process from message to resolution.',
    videoId: 'GVExvt4A2rs',
  },
  {
    slug: 'delivery-tracking',
    title: 'Delivery Tracking',
    dimension: 'execution',
    tagline: 'Surface slippage before it becomes a miss.',
    concept: 'Proactive delivery tracking is one of the highest-trust signals a PM can send to leadership. Waiting for the sprint review to surface risks means you\'re always one cycle behind. The best delivery tracking setups give you an early warning signal with enough lead time to course-correct — not just report what happened.',
    framework: [
      'Burndown + blockers: track both velocity and what\'s stopping it',
      'Traffic light status: Red/Amber/Green per workstream, reviewed mid-sprint',
      'Risk register: known risks + mitigation owner, updated weekly',
      'Forecast vs. actuals: track prediction accuracy to improve future estimates',
    ],
    exercise: 'It\'s Wednesday of a 2-week sprint. Your burndown shows you\'re on track, but two stories are blocked by a third-party API delay. How do you handle it — what do you escalate, what do you resolve, and what does your status update look like?',
    videoId: 'tSxiS_NX68M',
  },

  // ── technical_fluency ─────────────────────────────────────────────────────
  {
    slug: 'architecture-awareness',
    title: 'Architecture Awareness',
    dimension: 'technical_fluency',
    tagline: 'Seeing delivery risk before engineers have to explain it.',
    concept: 'Architecture awareness doesn\'t mean writing code — it means understanding the system well enough to flag risk early. When a PM asks about rollback plans and data volume implications, engineers notice. It signals you see the delivery surface, not just the product surface. That\'s what builds cross-functional trust with engineering.',
    framework: [
      'The 4 questions to ask on any significant backend change: scale, rollback, data migration, dependencies',
      'Spike-first rule: any architectural unknown > 2 days of effort deserves a spike',
      'System diagram literacy: read, don\'t draw — understand boundaries and bottlenecks',
      'Blast radius awareness: what breaks if this component fails?',
    ],
    exercise: 'Engineering tells you a new feature requires "moving data from a relational DB to a document store." You have no engineering background. What questions do you ask, what risk does this introduce to your launch timeline, and how do you communicate it to stakeholders?',
    videoId: 'uhtREgMnOFw',
  },
  {
    slug: 'api-literacy',
    title: 'API Literacy',
    dimension: 'technical_fluency',
    tagline: 'Understanding integrations before they become incidents.',
    concept: 'API literacy for PMs isn\'t about calling endpoints — it\'s about understanding what can go wrong. Rate limits, SLA guarantees, versioning policies, and authentication models are where third-party integrations become product reliability risks. The PM who checks these before committing to a launch date prevents 2am incidents from becoming product failures.',
    framework: [
      'Integration checklist: rate limits, SLA, auth model, versioning, sandbox availability',
      'Failure mode mapping: what happens to the user if this API returns a 500?',
      'Vendor dependency matrix: rate the risk of each third-party dependency',
      'Graceful degradation: define the fallback behaviour before launch, not after',
    ],
    exercise: 'Your team wants to integrate a payment provider for a new checkout flow. You have 3 weeks to launch. Walk through your pre-integration checklist and what blockers you\'d flag to engineering and leadership.',
    videoId: 'uhtREgMnOFw',
  },
  {
    slug: 'tech-debt-awareness',
    title: 'Tech Debt Awareness',
    dimension: 'technical_fluency',
    tagline: 'Keeping engineering trust intact over time.',
    concept: 'Tech debt is a product problem as much as an engineering problem. Ignoring it costs roadmap velocity; fighting every battle for a clean-up sprint costs engineering trust. The most durable model is negotiating a % of each sprint for debt work — it stays visible on the roadmap without competing for its own dedicated slot.',
    framework: [
      '20% rule: reserve 20% of sprint capacity for debt by default — adjust quarterly',
      'Debt taxonomy: performance, reliability, maintainability — each has different urgency',
      'Impact framing: translate technical debt into product risk for leadership',
      'Debt radar: track top 5 highest-risk debt items, reviewed monthly',
    ],
    exercise: 'Engineering raises a concern: the authentication system is 4 years old and increasing incident frequency. It\'s not on your roadmap. How do you evaluate the urgency, communicate the risk to leadership, and find space on the roadmap to address it?',
    videoId: '7rKQn1XKv94',
  },

  // ── user_research ─────────────────────────────────────────────────────────
  {
    slug: 'research-methods',
    title: 'Research Methods',
    dimension: 'user_research',
    tagline: 'Choosing the right method for the right question.',
    concept: 'Research method selection is one of the most underrated PM skills. Interviews validate the why behind behaviour; A/B tests validate what scales in production. Choosing the wrong method doesn\'t just waste time — it generates false confidence. The best PMs can map a research question to the right method in under a minute.',
    framework: [
      'Question → method mapping: generative questions need qual; evaluative questions need quant',
      'Minimum viable research: 5 interviews reveal most qualitative patterns',
      'Method selection grid: exploration vs. validation × known vs. unknown problem',
      'Research cadence: continuous discovery (weekly) vs. episodic (per initiative)',
    ],
    exercise: 'You have 2 weeks before a roadmap review. You need to validate that a proposed feature solves a real user problem. You also have an existing feature with dropping engagement you don\'t understand. What research methods do you use for each, and why?',
    videoId: 'mB3ud5u_9WM',
  },
  {
    slug: 'insight-synthesis',
    title: 'Insight Synthesis',
    dimension: 'user_research',
    tagline: 'Patterns beat memorable quotes.',
    concept: 'Raw interview notes are not insights — they\'re raw material. The synthesis step is where PMs earn their seat at the product table. Affinity mapping forces you to find structural patterns instead of cherry-picking confirming evidence. Themes that appear across 5+ sessions are the signal; everything else is noise until proven otherwise.',
    framework: [
      'Affinity mapping: write each observation on a card, cluster by theme, name the theme last',
      'Insight statement format: "When [context], users [behaviour], because [motivation]"',
      'Frequency vs. severity matrix: not all pain points are created equal',
      'Synthesis review: have someone not in the sessions challenge your themes',
    ],
    exercise: 'You ran 8 user interviews about your onboarding flow. You have 120 raw observations. Walk through your synthesis process from notes to three actionable product insights, including how you\'d present them in a team readout.',
    videoId: 'mB3ud5u_9WM',
  },
  {
    slug: 'metrics-qual-balance',
    title: 'Metrics + Qual Balance',
    dimension: 'user_research',
    tagline: 'When they conflict, it\'s almost always a context gap.',
    concept: 'Quantitative data tells you what\'s happening; qualitative data tells you why. When they conflict — high engagement but users saying they\'re frustrated — it\'s almost never a data quality problem. It\'s a context gap: you\'re measuring different things or different populations. Running more research to close that gap is always cheaper than shipping in the wrong direction.',
    framework: [
      'Conflict resolution loop: identify what each signal is measuring, look for population mismatch',
      'Mixed-methods sequencing: quant → what, qual → why, quant → does the fix work',
      'Signal hierarchy: operational metrics > self-reported satisfaction for behaviour prediction',
      'The 1% test: does this qualitative finding explain this 1% metric shift? If yes, it\'s meaningful',
    ],
    exercise: 'Your NPS dropped 8 points this quarter, but DAU is up 15%. How do you investigate the conflict? What research would you run, what stakeholders would you loop in, and how do you communicate the uncertainty while you investigate?',
    videoId: 'tSxiS_NX68M',
  },

  // ── communication ─────────────────────────────────────────────────────────
  {
    slug: 'upward-communication',
    title: 'Upward Communication',
    dimension: 'communication',
    tagline: 'Anchor to outcome. Everything else is supporting evidence.',
    concept: 'Leadership communication is a different skill than cross-functional communication. Executives are optimising for resource allocation across many competing priorities — they need outcome first, plan second, ask last. Starting with a feature list is the fastest way to lose your audience. Starting with the business outcome earns you the room to present your plan.',
    framework: [
      'BLUF structure: Bottom Line Up Front — outcome, plan, ask, in that order',
      'Pre-read protocol: share context 24h before, use the meeting for decisions only',
      'One metric framing: what single number does this move, and by how much?',
      'Risk transparency: flag risks proactively — surprises destroy trust faster than bad news',
    ],
    exercise: 'You need to present a 6-month roadmap to the CTO and VP of Sales. They have conflicting priorities. You have 20 minutes. Write the opening 3 sentences of your presentation and the structure of your deck.',
    videoId: 'U8a-oJf0cWc',
  },
  {
    slug: 'cross-functional-influence',
    title: 'Cross-functional Influence',
    dimension: 'communication',
    tagline: 'The translation layer between teams.',
    concept: 'Cross-functional influence is the PM\'s core operating mode. You have accountability without authority — which means persuasion, context-sharing, and aligning incentives is the job. Framing technical work as risk reduction with business impact is the translation layer that engineering can\'t always provide for themselves, and where PM adds irreplaceable value.',
    framework: [
      'Incentive mapping: understand what success looks like for each function before making an ask',
      'Business-risk framing: translate technical concerns into language that lands with leadership',
      'Reciprocity model: what does each team need from you before they\'ll prioritise your ask?',
      'Coalition building: get 2-3 aligned voices before the decision meeting, not in it',
    ],
    exercise: 'Engineering wants to skip a release to pay down technical debt. Sales has a committed customer demo in 3 weeks. Design is mid-way through a major UX overhaul. How do you align all three for a shared outcome without escalating to your manager?',
    videoId: 'GVExvt4A2rs',
  },
  {
    slug: 'conflict-resolution',
    title: 'Conflict Resolution',
    dimension: 'communication',
    tagline: 'Find the common goal beneath conflicting asks.',
    concept: 'Most stakeholder conflicts aren\'t really about features — they\'re about priorities, credit, or risk tolerance. Finding the common goal beneath conflicting asks resolves 80% of situations without escalation or shipping the wrong thing. The PM who can hold two opposing views simultaneously and find the synthesis earns a reputation as someone safe to raise problems to.',
    framework: [
      'Common goal excavation: ask both parties "what does success look like in 6 months?"',
      'Separate positions from interests: the ask is a position; the need behind it is the interest',
      'Decision criteria first: agree on how you\'ll decide before you decide',
      'Escalation as last resort: define clear criteria for when escalation is appropriate',
    ],
    exercise: 'The Head of Marketing wants to launch a campaign feature by Q3. The Head of Engineering says it\'s technically risky and will take 4 months. You\'re caught in the middle. Walk through your exact resolution process — including what you say to each person and what the outcome looks like.',
    videoId: 'GVExvt4A2rs',
  },
]

export function slugToTopic(slug: string): TopicContent | undefined {
  return TOPICS.find((t) => t.slug === slug)
}

export function subCategoryToSlug(subCategory: string): string {
  return subCategory
    .toLowerCase()
    .replace(/\s*\+\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}
