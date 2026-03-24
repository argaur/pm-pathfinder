import { Dimension } from '@/lib/data/questions'

export interface DimensionResource {
  title: string
  type: 'read' | 'exercise'
  duration: string
  description: string
}

export interface DimensionDetail {
  what: string
  levels: Record<'growth' | 'neutral' | 'strength', string>
  behaviors: Record<'growth' | 'neutral' | 'strength', string[]>
  resources: DimensionResource[]
  deepDiveHint: string
  nextStepAction: string
}

export const DIMENSION_DETAILS: Record<Dimension, DimensionDetail> = {
  thinking_strategy: {
    what: 'Thinking & Strategy is the ability to frame the right problem before jumping to solutions. It covers prioritisation, first-principles reasoning, trade-off evaluation, and setting product direction in ambiguous situations. This is the skill interviewers probe hardest — and the one that most clearly separates junior from senior PMs.',
    levels: {
      growth: 'You\'re a skilled executor looking for problems to solve, but you tend to accept the problem definition as given. You\'re most comfortable when someone else has framed the question and you\'re optimising within it. Interviews catch this when you dive into solutions before restating the problem.',
      neutral: 'You\'re aware of the value of problem framing and can do it when reminded. In structured settings you shine, but under pressure or with ambiguous briefs you default to what feels familiar. You\'re building the instinct — it\'s not yet automatic.',
      strength: 'You instinctively pause before solving. You reframe problem statements, challenge assumptions, and think in first principles. In interviews, you make interviewers feel heard before pivoting to structure. In teams, people bring you their problems because you help them see them differently.',
    },
    behaviors: {
      growth: [
        'You accept problem briefs without questioning the framing or the assumptions behind them',
        'In case study interviews, you jump to solutions within the first 2–3 minutes',
        'Your roadmap is defined more by stakeholder asks than by a strategic view of where the product needs to go',
      ],
      neutral: [
        'You can reframe a problem when prompted, but don\'t always do it spontaneously',
        'You use prioritisation frameworks like RICE when asked, but sometimes skip the step under deadline pressure',
        'You can articulate a product strategy in a 1:1, but struggle to do it in a 10-minute exec presentation',
      ],
      strength: [
        'You always restate the problem before committing to a direction — it\'s a non-negotiable first step for you',
        'You can connect a feature decision to a company-level strategic bet in under 60 seconds',
        'Your prioritisation reasoning is transparent and defensible — stakeholders can disagree, but can\'t question your logic',
      ],
    },
    resources: [
      {
        title: 'Good Strategy / Bad Strategy — Richard Rumelt (ch. 1–3)',
        type: 'read',
        duration: '25 min',
        description: 'The clearest articulation of what strategy actually means — and why most product strategies are just goals in disguise.',
      },
      {
        title: 'Reframe your last product decision',
        type: 'exercise',
        duration: '30 min',
        description: 'Pick a decision you made in the last month. Write the original problem statement. Ask "But what if the real problem is...?" three times. What changes about the solution when you use the third reframe?',
      },
    ],
    deepDiveHint: 'Dig into your prioritisation and problem framing sub-categories',
    nextStepAction: 'Start with Prioritisation Frameworks in your Learning Path',
  },

  execution: {
    what: 'Execution is the ability to take a decision from alignment to shipped — on time, to quality, with the team behind you. It covers sprint planning, scope negotiation, unblocking teams, and ensuring commitments are kept. Great executors are PM multipliers: their teams ship faster and with more clarity than teams without them.',
    levels: {
      growth: 'You ship things, but the path to shipped is often bumpy. Scope creep, missed dependencies, and late surprises are regular features of your work. You\'re better in design than delivery, and you may avoid the difficult scoping conversations that would make delivery more predictable.',
      neutral: 'You hit your commitments most of the time, but it requires active effort. You\'re building your instinct for what a sprint-ready story looks like. You\'re reliable, but not yet the person who generates clarity for others on the team.',
      strength: 'Your teams know exactly what they\'re building and why. You catch scope creep early, have a checklist for story readiness, and never walk into a sprint review with surprises. Engineers trust your estimates, and stakeholders trust your commitments.',
    },
    behaviors: {
      growth: [
        'Stories in your sprints often need clarification mid-sprint because acceptance criteria were vague at kickoff',
        'You frequently discover dependencies after work has already started',
        'You struggle to push back on scope additions from stakeholders mid-sprint',
      ],
      neutral: [
        'You ship on time more often than not, but it requires hustle rather than a repeatable process',
        'You know the sprint goal, but your team might struggle to articulate it without you in the room',
        'You\'re learning to protect space for tech debt alongside feature work',
      ],
      strength: [
        'Every story you add to a sprint has a problem statement, acceptance criteria, and engineering sign-off before it enters',
        'You\'ve built a personal playbook for sprint rituals that works across different team compositions',
        'Your stakeholders have stopped making mid-sprint requests because they trust your process and your process makes it feel safe to wait',
      ],
    },
    resources: [
      {
        title: 'Shape Up — Ryan Singer (Basecamp), ch. 1–3',
        type: 'read',
        duration: '20 min',
        description: 'The best PM book on execution you\'ve probably never read. Chapters 1–3 will change how you think about scope and commitment.',
      },
      {
        title: 'Write a 1-page sprint brief',
        type: 'exercise',
        duration: '20 min',
        description: 'For your next sprint: write the sprint goal (1 sentence), the 3 stories that serve that goal, and one thing explicitly NOT in scope. Share it with engineering before the planning meeting.',
      },
    ],
    deepDiveHint: 'Explore your sprint planning and delivery tracking sub-categories',
    nextStepAction: 'Open the Sprint Planning & Delivery chapter in your Learning Path',
  },

  technical_fluency: {
    what: 'Technical Fluency is not about writing code — it\'s about having credible technical conversations. It means understanding system constraints, reading a data flow diagram, having an informed opinion on build vs. buy decisions, and knowing enough to ask the right questions when engineers say "that\'s complex." It directly determines how much autonomy engineers give you.',
    levels: {
      growth: 'Technical discussions feel uncomfortable. You rely on engineering leads to translate requirements into implementation, and you tend to accept all estimates without challenging them. You avoid topics like architecture, databases, and APIs in conversations because you worry about saying the wrong thing.',
      neutral: 'You know enough to hold a basic technical conversation. You understand what APIs are, why migrations are risky, and what velocity means. Engineers respect you but don\'t yet loop you into architecture decisions early. You\'re technically aware but not yet technically fluent.',
      strength: 'Engineers treat you as a near-peer. You understand system boundaries well enough to have a real conversation about trade-offs. You can read an architecture diagram, identify potential bottlenecks, and negotiate scope on technical grounds. Engineering loops you in on design decisions — not just requirements.',
    },
    behaviors: {
      growth: [
        'You avoid asking technical questions in group settings for fear of sounding uninformed',
        'You accept all engineering estimates without discussion because you don\'t have the context to push back',
        'You can\'t describe how a feature you own actually works at the data layer',
      ],
      neutral: [
        'You understand the concept of a REST API and can discuss it in broad terms',
        'You can have a 1:1 with a senior engineer about architecture trade-offs, but you\'d struggle in a full design review',
        'You\'re building a vocabulary — you know the terms but aren\'t always sure of the precise implications',
      ],
      strength: [
        'You can read a sequence diagram and identify the specific steps that introduce risk or complexity',
        'You challenge engineering estimates by asking about specific layers: "Is the complexity in the data model or the business logic?"',
        'Engineering invites you into architecture discussions before requirements are written, not after',
      ],
    },
    resources: [
      {
        title: 'The Pragmatic Engineer — "What PMs wish engineers knew (and vice versa)"',
        type: 'read',
        duration: '15 min',
        description: 'Gergely Orosz\'s widely-cited piece on the PM–engineering partnership. Specific examples, not abstract advice.',
      },
      {
        title: 'Map a feature at the data layer',
        type: 'exercise',
        duration: '45 min',
        description: 'Pick one feature you own. Trace it end-to-end: user action → API call → database write → API response. Draw it on paper. Share with your tech lead and ask: "What did I miss?" The gap is your exact learning list.',
      },
    ],
    deepDiveHint: 'Dig into API literacy and tech debt navigation sub-categories',
    nextStepAction: 'Start the API & System Design Literacy chapter in your Learning Path',
  },

  user_research: {
    what: 'User & Research is the ability to generate, synthesise, and act on user insights. It covers qualitative interview techniques, usability testing, synthesis methods like affinity mapping, and — critically — the ability to move from raw observations to decision-ready insights. It\'s the "why" behind the data, and the skill that distinguishes PMs who build what users want from PMs who build what users say they want.',
    levels: {
      growth: 'You build on assumptions and stakeholder opinions more than on direct user evidence. Research feels time-consuming relative to its output — you often skip discovery under deadline pressure. In interviews, you can describe research methods but struggle to describe a specific insight that changed a product decision.',
      neutral: 'You run user research and get value from it. You can conduct an interview and identify themes. The gap is in synthesis: getting from raw notes to a clean, decision-ready insight quickly. You also struggle to decide which questions are worth researching versus which can be safely assumed.',
      strength: 'You\'re a research multiplier. You know which questions are worth investigating and which can be assumed away. You can run 5 interviews and produce a single insight that directly drives a product decision. Your research instinct is as sharp as your strategy instinct — they inform each other.',
    },
    behaviors: {
      growth: [
        'You default to "let\'s just build it and see" rather than validating key assumptions first',
        'Your user interviews often drift — you find yourself selling instead of listening',
        'You struggle to move from 8 pages of interview notes to a 3-bullet insight summary',
      ],
      neutral: [
        'You can run a structured interview and avoid leading questions most of the time',
        'You identify themes across user interviews but synthesis takes longer than you\'d like',
        'You sometimes do research after a decision is already made — to validate rather than to inform',
      ],
      strength: [
        'Before any discovery project, you write down your key assumptions and rank them by risk — research targets the riskiest ones',
        'Your insights have a consistent format: observation → pattern → implication → recommendation',
        'You know when to stop doing research — you can define the point at which additional interviews would change nothing',
      ],
    },
    resources: [
      {
        title: 'The Mom Test — Rob Fitzpatrick, ch. 1–2',
        type: 'read',
        duration: '20 min',
        description: 'The best book ever written on how to stop doing bad user research. Chapter 1 alone will change every interview you run.',
      },
      {
        title: 'Run a 3-interview synthesis sprint',
        type: 'exercise',
        duration: '90 min',
        description: 'Conduct 3 × 20-minute interviews. After each, write one "I was surprised that X because I assumed Y" statement. Build an affinity map from all three. Write your strongest insight in one sentence with a clear product implication.',
      },
    ],
    deepDiveHint: 'Explore your research methods and insight synthesis sub-categories',
    nextStepAction: 'Open User Interview Techniques in your Learning Path',
  },

  communication: {
    what: 'Communication is the PM\'s leverage function. Everything you ship requires alignment — from engineers who build it, to designers who shape it, to executives who fund it. Strong PM communication means concise executive updates, tight PRDs that engineers love, and the ability to drive cross-functional decisions without direct authority. It\'s how you turn your thinking into everyone else\'s action.',
    levels: {
      growth: 'Your written communication tends to be either too long (covering everything to stay safe) or too vague (avoiding commitment). In verbal settings, you struggle to land a clear recommendation when stakeholders have strong opinions. You\'re most comfortable as a facilitator — less comfortable as a decision-driver.',
      neutral: 'You communicate clearly in 1:1s and small team settings. In larger group settings or with senior stakeholders, you lose some confidence and precision. Your PRDs are read and understood — but they\'re not often cited as examples of great writing. You\'re reliable but not yet memorable.',
      strength: 'Your PRDs are clean enough that engineers want to build without asking questions. Your executive updates are 60-second-max: recommendation → 3 reasons → offer to go deeper. You can shift stakeholder opinion without them feeling pressured — they feel like they reached the conclusion themselves.',
    },
    behaviors: {
      growth: [
        'Your status updates are longer than they need to be because you\'re nervous about leaving something out',
        'You struggle to deliver a clear recommendation when a senior stakeholder is visibly resistant',
        'Your meeting outputs are often "let\'s discuss further" rather than a clear decision and owner',
      ],
      neutral: [
        'You know the Pyramid Principle but don\'t always apply it — it takes active effort rather than being instinctive',
        'Your cross-functional asks are clear but not always framed in the other person\'s language and priorities',
        'You\'re working on shortening your meeting recaps — they\'re accurate but longer than they need to be',
      ],
      strength: [
        'You open every executive interaction with the decision needed — never with context that builds slowly to the point',
        'When you need a cross-functional partner to act, you translate the ask into their metric, not yours',
        'Your team knows a meeting with you will end with a clear decision, a clear owner, and a clear next action',
      ],
    },
    resources: [
      {
        title: 'The Pyramid Principle — Barbara Minto (key concept overview)',
        type: 'read',
        duration: '15 min',
        description: 'The framework behind every great McKinsey document and every great PM update. Applies immediately to your next stakeholder email or Slack message.',
      },
      {
        title: 'Rewrite your last status update',
        type: 'exercise',
        duration: '20 min',
        description: 'Take your last status email or Slack message. Rewrite it using Pyramid structure: recommendation first, 3 reasons, offer to go deeper. Read both aloud and time them. The Pyramid version should deliver the key point in under 60 seconds.',
      },
    ],
    deepDiveHint: 'Dig into your executive communication and cross-functional influence sub-categories',
    nextStepAction: 'Start the Executive Communication chapter in your Learning Path',
  },
}
