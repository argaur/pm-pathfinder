# Commit Standards

## Format
```
<type>: <short description (max 72 chars)>

[optional body: what changed and why, wrap at 72 chars]
```

## Types
| Type     | When to use |
|----------|-------------|
| feat     | New feature or capability |
| fix      | Bug fix |
| refactor | Code restructure with no behavior change |
| chore    | Build, config, dependency updates |
| docs     | Documentation only |
| test     | Adding or updating tests |
| style    | Formatting, no logic change |
| perf     | Performance improvement |

## Rules
- Use present tense: "add login" not "added login"
- Do NOT include "Claude Code" or AI references in the message
- Do NOT commit: .env files, secrets, node_modules, build artifacts
- One logical change per commit — do not bundle unrelated work
- If a Codex review was done and findings were fixed, note it in the body:
  `Reviewed and hardened after adversarial code review.`

## Examples
```
feat: add OAuth2 login with Google provider

fix: prevent duplicate submissions on payment form

refactor: extract shared auth middleware into lib/auth

chore: upgrade next.js to v15.2
```
