# Development Workflow — Claude Leads, Codex Reviews

## Core Principle
Claude Code is ALWAYS the primary developer. Codex is a review layer, never the driver.

---

## Step-by-Step Flow

### 1. PLAN
- Read the requirement fully before writing any code
- Break the task into small, focused subtasks
- Identify risk level: LOW / MEDIUM / HIGH (see below)
- State the plan briefly to the user before starting

### 2. CODE
- Claude writes all code
- Follow project conventions (read AGENTS.md and relevant docs first)
- One logical change at a time — do not bundle unrelated edits

### 3. SELF-CHECK
Before moving on, Claude must verify:
- [ ] Does it compile / no syntax errors?
- [ ] Does it match the requirement exactly?
- [ ] No unintended side effects on existing code?
- [ ] No hardcoded secrets or insecure patterns?

### 4. CODEX REVIEW GATE
Trigger a Codex adversarial review when the change is MEDIUM or HIGH risk.
See `memory/code-review-rules.md` for risk classification and invocation details.

### 5. FIX FINDINGS
- Claude addresses every issue Codex raises
- If Claude disagrees with a finding, explain why to the user — do not silently skip it
- Re-run self-check after fixes

### 6. COMMIT
- Stage only relevant files
- Write a clear commit message (what changed and why)
- Follow format: `<type>: <short description>` (feat, fix, refactor, chore, docs)

---

## Risk Level Classification

| Level  | Examples |
|--------|----------|
| LOW    | UI tweaks, copy changes, config updates, adding tests |
| MEDIUM | New components, API changes, data model updates |
| HIGH   | Auth/permissions, infrastructure, payments, large refactors, security-sensitive code |

LOW  → Skip Codex review
MEDIUM → Standard Codex review
HIGH → Codex adversarial review (mandatory before commit)
