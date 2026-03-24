import { Dimension } from '@/lib/data/questions'

export interface LearningStep {
  id: string
  title: string
  whyInPath: string
  videoDuration: string
  textDuration: string
  videoId: string       // YouTube video ID — replace in Phase 9 with Rethink content
  concept: string
  framework: string
  exercise: string
}

export interface LearningChapter {
  id: string
  dimension: Dimension
  title: string
  subtitle: string
  beforeState: string
  beforeDesc: string
  afterState: string
  afterDesc: string
  steps: LearningStep[]
}

export const LEARNING_CHAPTERS: LearningChapter[] = [
  {
    id: 'thinking_strategy',
    dimension: 'thinking_strategy',
    title: 'Thinking & Strategy',
    subtitle: 'From responding to requests to setting direction',
    beforeState: 'The Order Taker',
    beforeDesc: 'You build what stakeholders request, working from reactive backlogs and incoming asks.',
    afterState: 'The Strategist',
    afterDesc: 'You frame the problem before solving it and use structured thinking to define direction.',
    steps: [
      {
        id: 'ts_0',
        title: 'Prioritisation Frameworks',
        whyInPath: 'Most PM interviews test this directly — knowing when to use RICE vs MoSCoW separates junior from senior candidates.',
        videoDuration: '14 min',
        textDuration: '10 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'Prioritisation is the core PM skill. Every decision you make is implicitly a prioritisation decision — what gets built, what gets cut, what gets deferred. The goal is not to have the best framework, but to make your reasoning transparent and defensible.',
        framework: 'RICE Scoring: Reach × Impact × Confidence ÷ Effort. Score each 1–10, divide by effort in weeks. Highest RICE score gets built first — unless a strategic bet overrides it (document overrides explicitly). Use MoSCoW for scope negotiations: Must Have / Should Have / Could Have / Won\'t Have.',
        exercise: 'Take 5 features from your current or imagined backlog. Score each using RICE. Then deliberately change one score and observe how the ranking shifts. The exercise teaches you where the model is sensitive — and where your gut was already right.',
      },
      {
        id: 'ts_1',
        title: 'Strategic Problem Framing',
        whyInPath: 'The single biggest mistake aspiring PMs make is jumping to solutions. Staying in the problem space longer is a rare skill that impresses every interviewer.',
        videoDuration: '18 min',
        textDuration: '12 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'The problem you are asked to solve is rarely the actual problem. "Users are churning" is a symptom. "Our onboarding has 47 required fields" is the problem. PMs who frame problems precisely build better products — and give better interview answers.',
        framework: 'The 5-Whys PM Stack: Start with the surface symptom. Ask "why is this happening?" five times. Each answer becomes the input to the next why. Stop when you hit a root cause you can actually address. Example: Why are users churning? → They don\'t complete onboarding → Too many required fields → We never defined what\'s actually required → No one owns the onboarding flow.',
        exercise: 'Pick one underperforming metric from your current or case study product. Run the 5-Whys. Write down each layer. Share it with someone — can they identify the root cause from your stack alone? Their confusion reveals where your logic jumped.',
      },
    ],
  },
  {
    id: 'execution',
    dimension: 'execution',
    title: 'Execution',
    subtitle: 'From delivering output to owning outcomes',
    beforeState: 'The Task Completer',
    beforeDesc: 'You deliver what\'s in the sprint. Done means shipped.',
    afterState: 'The Outcome Owner',
    afterDesc: 'You ship, measure, and iterate. Done means the metric moved.',
    steps: [
      {
        id: 'ex_0',
        title: 'Sprint Planning & Delivery',
        whyInPath: 'Engineering interviews will test this — you need to speak the language of sprints, stories, and acceptance criteria with full confidence.',
        videoDuration: '16 min',
        textDuration: '10 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'Sprint planning is where strategy dies or survives. The PM\'s job is to ensure every story in the sprint connects to a measurable outcome — not just a deliverable. A sprint without a goal is just a to-do list with a deadline.',
        framework: 'The Story Readiness Checklist — before any story enters a sprint: (1) Problem statement clear, (2) Acceptance criteria defined, (3) Dependencies flagged, (4) Design ready or confirmed not required, (5) Engineering has estimated. Missing any one → story moves to next sprint, no exceptions.',
        exercise: 'Write a sprint goal for a feature you know well — the goal first, before listing stories. Then select 5 stories that serve that goal. For each, write acceptance criteria in Given/When/Then format. Have an engineer review: do they have everything they need to start?',
      },
      {
        id: 'ex_1',
        title: 'Metrics-Driven Execution',
        whyInPath: '"I shipped X" impresses no one. "I shipped X and it moved Y by Z%" makes you unforgettable in interviews and in performance reviews.',
        videoDuration: '15 min',
        textDuration: '11 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'Every feature should have a pre-defined success metric agreed before development starts. This forces clarity on what "done" actually means — and gives you real numbers for your PM portfolio. Metrics agreed upfront also protect you when stakeholders shift goalposts after launch.',
        framework: 'The Feature Metrics Template: (1) North Star: which primary metric does this move? (2) Input metrics: which leading indicators will we track weekly? (3) Counter metrics: what must NOT get worse? (4) Measurement plan: how and when do we measure? (5) Minimum bar: what result would cause us to roll back?',
        exercise: 'Pick a feature you\'ve shipped or plan to ship. Fill out the full Feature Metrics Template before starting development. Share it with one stakeholder and ask: "If we hit these numbers, would you call this a success?" Their answer will reveal misaligned expectations early.',
      },
    ],
  },
  {
    id: 'technical_fluency',
    dimension: 'technical_fluency',
    title: 'Technical Fluency',
    subtitle: 'From translator to engineering partner',
    beforeState: 'The Relay Runner',
    beforeDesc: 'You relay requirements between business and engineering, hoping nothing gets lost in translation.',
    afterState: 'The Engineering Partner',
    afterDesc: 'You speak engineering well enough to reduce friction, challenge estimates, and earn team trust.',
    steps: [
      {
        id: 'tf_0',
        title: 'API & System Design Literacy',
        whyInPath: 'Technical PMs command 20–30% higher salaries. Understanding APIs removes the translation layer that slows every team down.',
        videoDuration: '20 min',
        textDuration: '14 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'PMs don\'t need to write code. They need to speak engineering. Understanding REST APIs, database concepts, and system boundaries removes the translation layer between product and eng. When you understand the constraint, you can negotiate scope instead of just accepting "that\'s complex."',
        framework: 'The PM Tech Stack Mental Model — map every feature to three layers: (1) Data layer: what gets persisted, what schema changes? (2) Logic layer: what rules transform the data, what edge cases exist? (3) Interface layer: what does the user see, what calls the API? When an engineer says "that\'s complex" you can now ask: which layer?',
        exercise: 'Take one feature you own. Draw its data flow: user action → API call → database operation → response. Share it with your tech lead and ask: "What did I miss?" The gap between your drawing and their answer is your exact learning agenda.',
      },
      {
        id: 'tf_1',
        title: 'Navigating Tech Debt Trade-offs',
        whyInPath: 'Every PM faces this conversation. Framing tech debt as a business risk — not a developer complaint — is a rare skill that earns deep engineering trust.',
        videoDuration: '13 min',
        textDuration: '9 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'Tech debt is not a developer problem — it\'s a product risk. Accumulated debt slows delivery, increases bug rates, and makes future features more expensive to build. The PM\'s job is to translate this into business impact the rest of the company can act on.',
        framework: 'The Tech Debt Business Case (4 parts): (1) Current velocity impact: "This module takes 3× longer to change than similar ones." (2) Compounding cost: "Every sprint we delay adds N engineer-hours." (3) Risk surface: "3 of our last 4 incidents came from this area." (4) Resolution proposal: "One focused sprint of debt work unlocks N sprints of clean velocity."',
        exercise: 'Ask your engineering lead to name the single biggest piece of tech debt. Translate it into a business case using the four-part framework. Present it at your next sprint planning or stakeholder sync. Note how the room responds to business language vs technical language.',
      },
    ],
  },
  {
    id: 'user_research',
    dimension: 'user_research',
    title: 'User & Research',
    subtitle: 'From assumption to evidence',
    beforeState: 'The Opinion Builder',
    beforeDesc: 'You build based on stakeholder intuition and your own hypotheses about what users need.',
    afterState: 'The Evidence-Driven Builder',
    afterDesc: 'You validate before shipping and use research to make faster, more confident decisions.',
    steps: [
      {
        id: 'ur_0',
        title: 'User Interview Techniques',
        whyInPath: 'Every PM role requires this. Interviewers will ask you to walk through a discovery process — knowing the mechanics is table stakes, showing craft is what gets you the offer.',
        videoDuration: '17 min',
        textDuration: '11 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'Structured user interviews reveal the gap between what users say they want and what they actually need. The goal is not validation — it\'s discovery. Your job is to uncover the underlying motivation, not confirm your hypothesis. Confirmation bias is the PM\'s most dangerous enemy.',
        framework: 'TEDW Question Framework — four openers that force open-ended answers: Tell me about... / Explain to me how you... / Describe a time when... / Walk me through... Add one follow-up to every answer: "And what happened next?" This moves you from stated preference to revealed behaviour.',
        exercise: 'Conduct 3 × 20-minute interviews with people in a target segment using ONLY TEDW questions — zero yes/no questions allowed. After each interview, write one insight in this format: "I was surprised that [X] because I assumed [Y]." That surprise is your signal.',
      },
      {
        id: 'ur_1',
        title: 'Synthesis & Insight Generation',
        whyInPath: 'Raw research is worthless without synthesis. This skill turns 8 interviews into a product decision — and it\'s the step most aspiring PMs skip entirely.',
        videoDuration: '14 min',
        textDuration: '10 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'Synthesis is the act of moving from individual observations to patterns, and from patterns to actionable insights. An observation: "User 3 had trouble finding the export button." An insight: "Users expect data export to live in account settings, not in the feature — consistent across 6 of 8 interviews." Only the insight drives a product decision.',
        framework: 'Affinity Mapping in 4 steps: (1) One observation per sticky note, (2) Cluster by theme without pre-labelling — let the clusters name themselves, (3) Label each cluster with an insight statement (not a topic: "Users feel anxious about pricing" not "Pricing"), (4) Vote on the top 3 insights by impact on your key metric.',
        exercise: 'Take your 3 interview notes from the previous exercise. Build a full affinity map. Identify your single top insight. Write a one-paragraph "What we learned and what we\'ll do differently" document. Share it with someone outside your team — can they understand the implication without context?',
      },
    ],
  },
  {
    id: 'communication',
    dimension: 'communication',
    title: 'Communication',
    subtitle: 'From reporting to influencing',
    beforeState: 'The Reporter',
    beforeDesc: 'You present updates upward and wait for decisions to come back down.',
    afterState: 'The Influencer',
    afterDesc: 'You build buy-in proactively, frame trade-offs clearly, and drive decisions without authority.',
    steps: [
      {
        id: 'co_0',
        title: 'Executive Communication',
        whyInPath: 'Your ability to communicate up will determine your career trajectory more than almost any technical skill. Leaders give resources to PMs they trust — and trust is built in 60-second interactions.',
        videoDuration: '16 min',
        textDuration: '10 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'Executive communication is about respecting attention. Leaders have 30 seconds per topic before they move on. Your job is to give them the most important information first, in a form they can act on — not a narrative that builds slowly to the recommendation.',
        framework: 'The Pyramid Principle for PM updates: (1) Lead with the recommendation or decision needed, (2) Follow with exactly 3 supporting reasons, (3) Offer the full evidence as backup if requested. Example: "We should delay launch by 2 weeks. [Reason 1: user testing found a critical flow bug. Reason 2: engineering needs time to fix it. Reason 3: delaying avoids a bad launch that damages trust.] Happy to go deeper on any of these."',
        exercise: 'Take your last status update. Rewrite it using the Pyramid Principle — recommendation first, 3 reasons, offer to go deeper. Read both versions aloud and time them. The Pyramid version should deliver the key point in under 60 seconds.',
      },
      {
        id: 'co_1',
        title: 'Cross-functional Influence',
        whyInPath: 'PMs have no direct reports. Everything you ship requires influence. This is the most underrated PM skill — and the one interviewers probe hardest with behavioural questions.',
        videoDuration: '15 min',
        textDuration: '12 min',
        videoId: 'dQw4w9WgXcQ',
        concept: 'Influence without authority means understanding what each stakeholder cares about and framing your ask in those terms. The same feature request needs a different pitch for engineering (reduced complexity), design (user clarity), data (metric impact), and leadership (business outcome). The ask is the same — the frame is different.',
        framework: 'The Stakeholder Translation Matrix — for each key stakeholder identify: (1) Their primary goal this quarter, (2) Their biggest risk or fear, (3) How your ask helps their goal OR reduces their risk. Then present using their language. "This reduces the support ticket volume that\'s making your team\'s life difficult" lands better than "this improves UX."',
        exercise: 'Identify one ask you need to make in the next week — feature approval, resource, timeline. Build the full Stakeholder Translation Matrix for the key decision-maker. Make the ask using their language. Write down their response — did framing in their terms change the conversation?',
      },
    ],
  },
]
