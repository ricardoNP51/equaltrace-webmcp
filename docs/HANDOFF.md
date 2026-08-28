# Cross-PC handoff

This is the canonical continuation procedure. Do not copy `node_modules`, caches, builds, recordings, or local browser profiles between machines.

## Before leaving the current PC

```powershell
git status --short --branch
git rev-parse HEAD
git ls-remote origin refs/heads/main
```

Record the exact branch and commit in `docs/STATUS.md`. Local and remote hashes must match before calling the handoff complete.

## On the next Windows PC

```powershell
git clone https://github.com/ricardoNP51/equaltrace-webmcp.git
Set-Location equaltrace-webmcp
git switch main
git pull --ff-only
node --version
npm --version
```

Phase 1 is active. Checklist items 1–6 created the reproducible core, shared store, stable native WebMCP spine, real visual/assistive route capture, and the responsive judge-first verdict/evidence experience. The full native three-route baseline passed on implementation commit `347db59c3c90588299881fb67059241f2864663c`; the Phase 6 presentation passed on implementation commit `d8f85295d21ff9e603995a168495c5c6dc1bfa24`. Exact records are under `evidence/native/` and `evidence/ui/`. The saved Devpost workflow points to `$build-project`, and item 7 (bounded repair staging and the human-only approval boundary) is next. Recreate dependencies with `npm ci`; never copy `node_modules`.

The local branch is ahead of `origin/main`. HTTPS push is currently rejected because the GitHub credential lacks `workflow` scope, and SSH has no configured key. Refresh the GitHub credential with `gh auth refresh -h github.com -s workflow` before the next required remote synchronization.

## First continuation prompt

Use this exact prompt with Codex on the next PC:

> Continue EqualTrace from the checked-out Phase 1 repository. First read AGENTS.md, docs/STATUS.md, docs/PRIORITIZATION.md, docs/WINNING_STANDARD.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, and every file in docs/hackathon-build/. Verify the current branch and commit, run `npm ci`, then resume the saved `$build-project` flow in autonomous mode at the first unchecked item in docs/hackathon-build/checklist.md. Run `npm run check` before every implementation commit. Do not skip verification gates or claim native WebMCP validation from mocks or a polyfill. Update the checklist, STATUS.md, HANDOFF.md, and build-notes.md with exact evidence before stopping.

## GitHub authentication if needed

```powershell
gh auth login -h github.com -w
gh auth status
```

Never commit tokens, browser profiles, `.env` files, recordings containing private information, or Devpost credentials.
