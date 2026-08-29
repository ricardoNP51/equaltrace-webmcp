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
git switch --track origin/codex/phase6-continuation
git pull --ff-only
node --version
npm --version
```

Phase 1 is active. Checklist items 1–7 created the reproducible core, shared store, stable native WebMCP spine, real visual/assistive route capture, responsive judge-first evidence experience, deterministic repair proposal, and visible human-only approval boundary. The full native three-route baseline passed on implementation commit `347db59c3c90588299881fb67059241f2864663c`; the presentation passed on `d8f85295d21ff9e603995a168495c5c6dc1bfa24`; the item 7 implementation passed on `b2112b07ae66ca2df72d466e5d8d4c2a74e5c8f0`. Exact native/UI records are under `evidence/native/` and `evidence/ui/`; automated item 7 evidence is in the repair unit, component, and Playwright suites. The saved Devpost workflow points to `$build-project`, and item 8 (temporary single-use repair capability lifecycle) is next. Recreate dependencies with `npm ci`; never copy `node_modules`.

The active continuation branch is `codex/phase6-continuation`. Confirm the exact local and remote hashes before declaring a cross-PC handoff synchronized; do not silently fall back to `main`, which does not contain the current implementation.

## First continuation prompt

Use this exact prompt with Codex on the next PC:

> Continue EqualTrace from branch `codex/phase6-continuation` at or after implementation commit `b2112b07ae66ca2df72d466e5d8d4c2a74e5c8f0`. First read AGENTS.md, docs/STATUS.md, docs/PRIORITIZATION.md, docs/WINNING_STANDARD.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, and every file in docs/hackathon-build/. Verify the current branch and commit, run `npm ci`, then resume the saved `$build-project` flow in autonomous mode at item 8 in docs/hackathon-build/checklist.md. Run `npm run check` before every implementation commit. Do not skip verification gates or claim native WebMCP validation from mocks or a polyfill. Update the checklist, STATUS.md, HANDOFF.md, and build-notes.md with exact evidence before stopping.

## GitHub authentication if needed

```powershell
gh auth login -h github.com -w
gh auth status
```

Never commit tokens, browser profiles, `.env` files, recordings containing private information, or Devpost credentials.
