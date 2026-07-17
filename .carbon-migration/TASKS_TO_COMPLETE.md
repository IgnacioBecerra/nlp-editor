# Carbon Migrate front-end-developer — Session Checklist

> This file tracks one migration-agent session for one claimed work unit.
> It is intentionally a short checklist, not a multi-phase build ledger.

## Status Legend

- ✅ COMPLETE — finished in this session
- 🔄 IN PROGRESS — started, not yet complete
- ⏳ PENDING — not started in this session
- ❌ BLOCKED — waiting on an external prerequisite or decision

---

## Session Workflow

| # | Task | Status |
|---|---|---|
| 1 | Read `.carbon-migration/AGENT_PROMPT_RESUME.md`, confirm `job_id`, `unit_id`, exact `unit_files`, `folder_prefix`, `branch`, `source_framework`, `target_framework`, and any custom `eval_criteria`. | ⏳ PENDING |
| 2 | Rebase the branch from the generated prompt: `git pull --rebase origin <branch-from-generated-prompt>`. Do not edit files before this succeeds. | ⏳ PENDING |
| 3 | Read `.carbon-migration/migration-context/INDEX.md`. Perform Phase 0 self-scan: read `package.json`, grep for `Carbon v10 (upgrade)` imports in `the assigned folder scope`, identify applicable Carbon UI patterns, document findings in the ledger. | ⏳ PENDING |
| 4 | Load the relevant component map from `migration-context/maps/` per INDEX.md load rules. Verify `Carbon React v11` APIs via the `carbon-builder` skill / Carbon MCP (`code_search`/`docs_search`) — model memory only as a fallback — once per component per unit, recorded in the ledger. Always verify icon/pictogram export names via `code_search` `asset_type:"icon"`. See the Carbon API verification budget in `SPEC.md`. | ⏳ PENDING |
| 5 | Migrate the assigned files only, converting `Carbon v10 (upgrade)` patterns to `Carbon React v11` in place on the checked out branch. Reuse compatible files and generate replacement implementation only where required. | ⏳ PENDING |
| 6 | Run the full eval gate (see AGENT_PROMPT_RESUME.md eval criteria). All checks must pass before committing. | ⏳ PENDING |
| 7 | If eval passes, stage intended changes only, commit with `migrate(<unit_id>): Assigned work unit`, and push to `<branch-from-generated-prompt>`. On push rejection, do the rebase/eval retry loop and stop after 3 total attempts. | ⏳ PENDING |
| 8 | Write `front-end-developer/.agent/status.json` before exit. Use `done` only when the unit is fully migrated and pushed; otherwise use `continue`, `blocked`, `failed`, or `infra_failed` with a precise message. | ⏳ PENDING |

---

## Notes

- Use this checklist as the authoritative progress tracker for the current unit.
- If the repo context is wrong, the branch does not exist, or the generated prompt is stale, stop early and mark the affected steps `❌ BLOCKED` instead of pushing ahead on guesses.
- If `MIGRATION_AGENT_PROTOCOL.md` is absent in the target repo, record that fact in this file and continue only if the generated prompt or available Carbon guidance is sufficient to complete the unit safely.

---

## Supervisor Run Ledger

Append one short entry per run in this format:

- `YYYY-MM-DDTHH:MM:SSZ | run #NNNN | status=<continue|done|blocked|failed|infra_failed> | progress_marker=<stable marker> | next=<single next step>`

Rules:

- Append entries; do not delete prior run entries.
- Keep entries concise and factual.
- Ensure `status` and `progress_marker` match `.agent/status.json` for the same run.
- 2026-07-17T22:46:41Z | run #0010 | agent=bob | status=done | progress_marker=final-fed-refinement-complete | stdout_tokens≈18,707 | message=Final FED refinement complete: checklist=8/8 pass on iteration 1; fixed SCSS entry @carbon/styles→@carbon/react; staged=1; verification=build-pass
