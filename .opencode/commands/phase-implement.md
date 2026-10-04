---
description: Implement a repository phase with minimal scoped changes
agent: build
---

Phase to implement:

$ARGUMENTS

## Before editing

1. Read and follow `AGENTS.md` (governance, invariants, prohibitions, validation).
2. Use the "Router Operacional por Tarea" table in `docs/index.md` to locate the
   canonical file and the relevant skill for this phase.
3. Load that skill before touching code, and follow its procedure.
4. Inspect the existing implementation before creating anything new.

## Rules

- Make the smallest safe change that satisfies the phase.
- Reuse existing components, utilities and styles whenever appropriate.
- Do not redesign existing UI unless explicitly requested.
- Do not expand the scope and do not refactor in passing.
- Do not invent new architecture.
- Respect the protected files and the authorization levels defined in `AGENTS.md`.
- Keep `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` and `.github/copilot-instructions.md`
  compatible with every other agent that consumes them.

## Validation

Run the validation that `docs/index.md` assigns to this task, plus the mandatory
sequence in `skills/portfolio-validation/SKILL.md`.

## At the end

1. Report: files changed, what changed, validation performed and its result,
   remaining limitations if any, and the commit message.
2. Commit only the files you modified, using that message. Do not include
   unrelated changes that were already uncommitted.
3. Do not run `git push`: the user handles pushing to the remote.
