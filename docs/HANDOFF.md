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

Phase 1 is active. Checklist items 1–9 now complete the broken-to-repaired winner chain: reproducible core, shared store, stable native WebMCP spine, real visual/assistive capture, judge-first failure evidence, deterministic bounded proposal, visible human-only approval, exact single-use repair capability, fresh three-route repaired proof, and deterministic receipt. Item 9 passed automated and local native gates on implementation commit `25c4276f730b981355d7e70c220dbff22abc3c59`; two equivalent native reruns produced receipt ID `80d69ae946fc941d2f4192f5cfbda980eefa9612124f68c45e11c6a54de6650b`. Exact native/UI records are under `evidence/native/` and `evidence/ui/`; the repaired receipt record is `evidence/native/2026-08-30-repaired-rerun-receipt.md`. The saved Devpost workflow still points to `$build-project`, and item 10 (accessibility, adversarial states, and clean-clone release gate) is next. Recreate dependencies with `npm ci`; never copy `node_modules`.

The active continuation branch is `codex/phase6-continuation`. Confirm the exact local and remote hashes before declaring a cross-PC handoff synchronized; do not silently fall back to `main`, which does not contain the current implementation.

## First continuation prompt

Use this exact prompt with Codex on the next PC:

> Continue EqualTrace from branch `codex/phase6-continuation` at or after implementation commit `25c4276f730b981355d7e70c220dbff22abc3c59`. First read AGENTS.md, docs/STATUS.md, docs/PRIORITIZATION.md, docs/WINNING_STANDARD.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, and every file in docs/hackathon-build/. Verify the current branch and commit, run `npm ci`, then resume the saved `$build-project` flow in autonomous mode at item 10 in docs/hackathon-build/checklist.md. Run `npm run check` before every implementation commit. Do not skip verification gates or claim native WebMCP validation from mocks or a polyfill. Update the checklist, STATUS.md, HANDOFF.md, and build-notes.md with exact evidence before stopping.

## GitHub authentication if needed

```powershell
gh auth login -h github.com -w
gh auth status
```

Never commit tokens, browser profiles, `.env` files, recordings containing private information, or Devpost credentials.
