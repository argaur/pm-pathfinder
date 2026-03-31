# Code Review Rules — When and How to Invoke Codex

## When to Trigger Codex Review

### Always trigger for:
- Changes to authentication or authorization logic
- Payment or billing related code
- Database schema changes or migrations
- Security-sensitive operations (tokens, secrets, encryption)
- Infrastructure / deployment config changes
- Any change touching 5+ files
- Before creating a pull request
- Large refactors

### Use judgment for:
- New API endpoints
- Data model changes
- Third-party integrations
- Performance-critical paths

### Skip for:
- Pure UI/styling changes with no logic
- Documentation updates
- Adding or updating tests only
- Config values (non-security)

---

## How to Invoke Codex Review

### Standard Review (MEDIUM risk)
```
codex: please review the following changes for correctness, edge cases, and code quality.
[paste diff or describe changes]
```

### Adversarial Review (HIGH risk)
```
codex: perform an adversarial/skeptical review of these changes.
Actively look for security vulnerabilities, logic errors, race conditions,
and ways this could break in production.
[paste diff or describe changes]
```

### Branch Comparison Review
```
codex: compare current changes against [branch-name] and flag any regressions or conflicts.
```

---

## After Codex Review

1. Claude reads every finding
2. Categorizes each as: FIX / EXPLAIN / DEFER
3. Fixes all FIX items before committing
4. Explains EXPLAIN items to user (disagreements or false positives)
5. Logs DEFER items as TODO comments with context
6. Never silently ignores a finding
