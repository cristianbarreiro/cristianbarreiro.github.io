---
description: Run the repository Definition of Done for a specific phase
agent: build
---

Phase to validate:

$ARGUMENTS

## Sequence

1. Read `skills/portfolio-validation/SKILL.md` and run its steps in order, using
   the commands exactly as written in that skill, without rewriting them:
   - Step 1 → `npm run lint`
   - Step 2 → i18n parity check (copy the exact command from the skill)
   - Step 3 → `npm run build`, confirming `TechGlobe` stays in its own chunk
2. Complete the "Auditoría Estática de Invariantes" checklist (section 2 of that
   skill) by inspecting the diff of this phase.
3. Run additional checks only when they are pertinent to the scope of the phase.

## Forbidden

- `npm run deploy`.
- Destructive Git commands.

## Output

Report exactly this block, with PASS or FAIL on every line:

```
Lint: PASS/FAIL
i18n: PASS/FAIL
Build: PASS/FAIL
Additional QA: PASS/FAIL/N/A
Overall: PASS/FAIL
```
