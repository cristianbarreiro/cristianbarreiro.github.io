---
description: Review the current uncommitted phase diff without modifying files
agent: plan
---

Scope declared for this phase:

$ARGUMENTS

## Method

1. `git status` — which files are touched.
2. `git diff` — the actual change.
3. Compare that diff against the scope declared above.

## What to review

- Does the diff stay within the requested scope?
- Is there any refactor or change outside that scope?
- i18n: hardcoded visible strings, ES/EN key parity.
- Accessibility: `aria-label` on new interactive elements, `prefers-reduced-motion`.
- Responsive: does it break on a narrow viewport?
- Reuse: does it reinvent something that already exists?
- Architecture: does it violate any invariant in `AGENTS.md`?
- Protected files: was any file that AGENTS.md marks as protected touched?
- Potential regressions in the behaviour that was left untouched.

## Restrictions

- Do not edit any file.
- Do not commit.
- Do not run `npm run deploy` or destructive Git commands.

## Output

One finding per line, with severity `CRITICAL`, `HIGH`, `MEDIUM` or `LOW`,
stating file:line, what is wrong and why it matters.
If there are no relevant findings, answer `PASS` and nothing else.
