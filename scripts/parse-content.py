"""
Parse 'Learning Material - Product Navigator.docx' → lib/data/archetype-content.ts

Run from project root:
  python scripts/parse-content.py
"""

import docx
import re
import os

DOCX_PATH = r'C:\Users\Gaurav Gupta\Documents\Professional\Learning\Rethink AI MPM - Cohort 7\Weekday Sessions\Week 6\Learning Material - Product Navigator.docx'
OUTPUT_TS = os.path.join(os.path.dirname(__file__), '..', 'lib', 'data', 'archetype-content.ts')

# Docx archetype title → platform archetype id
ARCHETYPE_MAP = {
    'THE STRATEGIST': 'strategist',
    'THE EXPLORER': 'architect',   # closest: Technical × Strategy
    'THE OPERATOR': 'operator',
    'THE ADVOCATE': 'advocate',
    'THE BUILDER': 'builder',
}

# Topic name → dimension id
TOPIC_DIMENSION = {
    'Product Sense': 'thinking_strategy',
    'Product Strategy': 'thinking_strategy',
    'Metrics & KPIs': 'thinking_strategy',
    'Guesstimates': 'thinking_strategy',
    'A/B Testing': 'thinking_strategy',
    'Competitive Analysis': 'thinking_strategy',
    'Prioritisation': 'execution',
    'Go-to-Market': 'execution',
    'Roadmapping': 'execution',
    'Tech Fundamentals': 'technical_fluency',
    'AI/ML for PMs': 'technical_fluency',
    'Data & SQL': 'technical_fluency',
    'System Design': 'technical_fluency',
    'User Research': 'user_research',
    'UX Thinking': 'user_research',
    'Customer Empathy': 'user_research',
    'Product Storytelling': 'communication',
    'Stakeholder Influence': 'communication',
    'Stakeholder Management': 'communication',
    'Written Communication': 'communication',
}

DIMENSIONS = ['thinking_strategy', 'execution', 'technical_fluency', 'user_research', 'communication']

CHAPTER_META = {
    'thinking_strategy': {
        'title': 'Thinking & Strategy',
        'subtitle': 'From responding to requests to setting direction',
        'beforeState': 'The Order Taker',
        'beforeDesc': 'You build what stakeholders request, working from reactive backlogs and incoming asks.',
        'afterState': 'The Strategic Thinker',
        'afterDesc': 'You frame the problem before solving it and use structured thinking to define direction.',
    },
    'execution': {
        'title': 'Execution',
        'subtitle': 'From delivering output to owning outcomes',
        'beforeState': 'The Task Completer',
        'beforeDesc': "You deliver what's in the sprint. Done means shipped.",
        'afterState': 'The Outcome Owner',
        'afterDesc': 'You ship, measure, and iterate. Done means the metric moved.',
    },
    'technical_fluency': {
        'title': 'Technical Fluency',
        'subtitle': 'From translator to engineering partner',
        'beforeState': 'The Relay Runner',
        'beforeDesc': 'You relay requirements between business and engineering, hoping nothing gets lost in translation.',
        'afterState': 'The Engineering Partner',
        'afterDesc': 'You speak engineering well enough to reduce friction, challenge estimates, and earn team trust.',
    },
    'user_research': {
        'title': 'User & Research',
        'subtitle': 'From assumption to evidence',
        'beforeState': 'The Opinion Builder',
        'beforeDesc': 'You build based on stakeholder intuition and your own hypotheses about what users need.',
        'afterState': 'The Evidence-Driven Builder',
        'afterDesc': 'You validate before shipping and use research to make faster, more confident decisions.',
    },
    'communication': {
        'title': 'Communication',
        'subtitle': 'From presenter to influencer',
        'beforeState': 'The Presenter',
        'beforeDesc': 'You share information and hope for alignment. Updates are reports, not conversations.',
        'afterState': 'The Influencer',
        'afterDesc': 'You build buy-in without authority. People act because they want to, not because they must.',
    },
}

DIM_ID_PREFIX = {
    'thinking_strategy': 'ts',
    'execution': 'ex',
    'technical_fluency': 'tf',
    'user_research': 'ur',
    'communication': 'co',
}

SECTION_ORDER = {'growth': 0, 'neutral': 1, 'strength': 2}
SECTION_DURATIONS = {
    'growth': ('18 min', '12 min'),
    'neutral': ('12 min', '8 min'),
    'strength': ('8 min', '5 min'),
}


def normalize_topic(text):
    text = text.strip()
    text = re.sub(r'^\d+\s*[—–\-]\s*', '', text)
    text = text.replace('AI / ML', 'AI/ML')
    return text.strip()


def clean_text(text):
    return (text
        .replace('\u2014', '--').replace('\u2013', '-')
        .replace('\u201c', '"').replace('\u201d', '"')
        .replace('\u2018', "'").replace('\u2019', "'")
        .replace('\u20b9', 'INR ').replace('\u2192', ' -> ')
        .replace('\u00a0', ' ').replace('\u25cf', '* ')
        .replace('\u2022', '* ').replace('\u2026', '...')
        .strip()
    )


def extract_topic_content(paras, start_idx, end_idx, section):
    raw = [clean_text(paras[i].text) for i in range(start_idx + 1, end_idx) if paras[i].text.strip()]

    if section == 'growth':
        concept_parts, framework_parts, exercise_parts = [], [], []
        mode = 'start'
        for p in raw:
            if p == 'THE BIG IDEA':
                mode = 'concept'
            elif p == 'THE EXERCISE' or p.startswith('THE EXERCISE --') or p.startswith('THE EXERCISE -'):
                mode = 'exercise'
            elif p == 'GO DEEPER':
                mode = 'done'
            elif re.match(r'^PART \d', p):
                if mode in ('concept', 'start'):
                    mode = 'framework'
                    framework_parts.append(p)
                # skip other PART headers
            elif mode == 'concept' and len(concept_parts) < 3:
                concept_parts.append(p)
            elif mode == 'framework' and len(framework_parts) < 6:
                framework_parts.append(p)
            elif mode == 'exercise' and len(exercise_parts) < 4:
                exercise_parts.append(p)
            elif mode == 'done':
                break

        concept = ' '.join(concept_parts)[:650] or 'See the full curriculum for this topic.'
        framework = ' '.join(framework_parts)[:750] or 'Core frameworks covered in the curriculum guide.'
        exercise = ' '.join(exercise_parts)[:550] or 'Complete the structured exercise in the curriculum guide.'

    else:  # strength or neutral
        concept_parts, framework_parts = [], []
        mode = 'start'
        for p in raw:
            if p == 'WHAT THIS IS':
                mode = 'concept'
            elif p == 'KEY FRAMEWORK':
                mode = 'framework'
            elif p == 'GO DEEPER':
                break
            elif mode == 'concept' and len(concept_parts) < 2:
                concept_parts.append(p)
            elif mode == 'framework' and len(framework_parts) < 2:
                framework_parts.append(p)

        concept = ' '.join(concept_parts)[:550] or 'You have solid fundamentals here.'
        framework = ' '.join(framework_parts)[:550] or 'Review the key framework in the curriculum guide.'
        exercise = ('This is a strength area for your archetype. Focus on the Go Deeper readings to maintain your edge. '
                    'In interviews, be ready to explain the framework clearly and give a specific example from your experience.')

    return concept, framework, exercise


def parse_doc():
    doc = docx.Document(DOCX_PATH)
    paras = doc.paragraphs

    # Collect all structural boundaries
    boundaries = []
    for i, para in enumerate(paras):
        style = para.style.name
        text = para.text.strip()
        if not text:
            continue
        if style == 'Title' and text in ARCHETYPE_MAP:
            boundaries.append((i, 'archetype', text))
        elif style == 'Heading 1':
            if 'Growth' in text:
                boundaries.append((i, 'section', 'growth'))
            elif 'Strength' in text:
                boundaries.append((i, 'section', 'strength'))
            elif 'Neutral' in text:
                boundaries.append((i, 'section', 'neutral'))
        elif style == 'Heading 2':
            topic = normalize_topic(text)
            boundaries.append((i, 'topic', topic))

    # Extract content using boundaries
    result = {}
    archetype_id = None
    section = None

    for i, (idx, btype, value) in enumerate(boundaries):
        next_idx = boundaries[i + 1][0] if i + 1 < len(boundaries) else len(paras)

        if btype == 'archetype':
            archetype_id = ARCHETYPE_MAP[value]
            if archetype_id not in result:
                result[archetype_id] = {}
        elif btype == 'section':
            section = value
        elif btype == 'topic':
            if not archetype_id or not section:
                continue
            dim = TOPIC_DIMENSION.get(value)
            if not dim:
                continue
            concept, framework, exercise = extract_topic_content(paras, idx, next_idx, section)
            if value not in result[archetype_id]:  # first occurrence wins
                result[archetype_id][value] = {
                    'section': section,
                    'dimension': dim,
                    'concept': concept,
                    'framework': framework,
                    'exercise': exercise,
                }

    return result


def esc(s):
    """Escape a string for a TypeScript single-quoted string."""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ').replace('\r', '')


def make_why(topic_name, section):
    if section == 'growth':
        return f"{topic_name} is one of your key growth areas -- building real competency here will be your biggest unlock as a PM candidate."
    elif section == 'strength':
        return f"You are already strong in {topic_name}. This session keeps your skills sharp for interviews and day-to-day product work."
    else:
        return f"You have a solid foundation in {topic_name}. This session raises it from average to reliable PM competency."


def generate_ts(data):
    lines = [
        "// Auto-generated from 'Learning Material - Product Navigator.docx'",
        "// Run scripts/parse-content.py to regenerate.",
        "",
        "import type { LearningChapter } from './learning-path'",
        "",
        "export const ARCHETYPE_CHAPTERS: Record<string, LearningChapter[]> = {",
    ]

    # storyteller uses advocate content as fallback (both human-centered)
    archetype_render_order = list(data.keys()) + ['storyteller']

    for archetype_id in archetype_render_order:
        source_id = 'advocate' if archetype_id == 'storyteller' else archetype_id
        topics = data.get(source_id, {})

        lines.append(f"  {archetype_id}: [")

        for dim in DIMENSIONS:
            meta = CHAPTER_META[dim]
            prefix = DIM_ID_PREFIX[dim]

            dim_topics = [
                (name, info) for name, info in topics.items() if info['dimension'] == dim
            ]
            dim_topics.sort(key=lambda x: SECTION_ORDER.get(x[1]['section'], 1))
            selected = dim_topics[:2]

            if not selected:
                continue

            lines.append("    {")
            lines.append(f"      id: '{dim}',")
            lines.append(f"      dimension: '{dim}' as const,")
            lines.append(f"      title: '{esc(meta['title'])}',")
            lines.append(f"      subtitle: '{esc(meta['subtitle'])}',")
            lines.append(f"      beforeState: '{esc(meta['beforeState'])}',")
            lines.append(f"      beforeDesc: '{esc(meta['beforeDesc'])}',")
            lines.append(f"      afterState: '{esc(meta['afterState'])}',")
            lines.append(f"      afterDesc: '{esc(meta['afterDesc'])}',")
            lines.append("      steps: [")

            for step_idx, (topic_name, info) in enumerate(selected):
                section = info['section']
                vid_dur, txt_dur = SECTION_DURATIONS[section]
                step_id = f'{prefix}_{step_idx}'
                why = make_why(topic_name, section)

                lines.append("        {")
                lines.append(f"          id: '{step_id}',")
                lines.append(f"          title: '{esc(topic_name)}',")
                lines.append(f"          whyInPath: '{esc(why)}',")
                lines.append(f"          videoDuration: '{vid_dur}',")
                lines.append(f"          textDuration: '{txt_dur}',")
                lines.append(f"          videoId: 'dQw4w9WgXcQ',")
                lines.append(f"          concept: '{esc(info['concept'])}',")
                lines.append(f"          framework: '{esc(info['framework'])}',")
                lines.append(f"          exercise: '{esc(info['exercise'])}',")
                lines.append("        },")

            lines.append("      ],")
            lines.append("    },")

        lines.append("  ],")

    lines.append("}")
    return '\n'.join(lines)


if __name__ == '__main__':
    print("Parsing docx...")
    data = parse_doc()

    print(f"Parsed {len(data)} archetypes:")
    for arch, topics in data.items():
        by_section = {}
        for t, info in topics.items():
            by_section.setdefault(info['section'], []).append(t)
        print(f"  {arch}: {len(topics)} topics — growth={len(by_section.get('growth',[]))}, neutral={len(by_section.get('neutral',[]))}, strength={len(by_section.get('strength',[]))}")

    print("\nGenerating TypeScript...")
    ts = generate_ts(data)

    out_path = os.path.normpath(OUTPUT_TS)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(ts)

    print(f"Written to: {out_path}")
    print(f"File size: {len(ts)} chars")
