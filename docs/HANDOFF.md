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

Phase 1 is active. Checklist items 1–11 complete the broken-to-repaired winner chain, release hardening, exact public deployment, and five-run native release proof. Release `challenge-v1.0.0` is deployed from commit `20ccacc499fcb8f7fed126f10af38e820c95b335` at `https://ricardonp51.github.io/equaltrace-webmcp/`; two CI runs and the Pages workflow passed for that SHA. A new clone of the public tag passed `npm ci && npm run check`. Five consecutive fresh native runs in Codex In-app Browser `26.825.41651` produced receipt ID `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728` and the lifecycle absent → appeared → used → absent every time. Exact evidence is in `evidence/native/2026-08-30-public-release-five-run.md` and its completed machine-readable manifest. The saved Devpost workflow still points to `$build-project`; item 12 submission handoff preparation is next. Recreate dependencies with `npm ci`; never copy `node_modules`.

The active continuation branch is `codex/phase6-continuation`. `main` and this branch both contain release commit `20ccacc499fcb8f7fed126f10af38e820c95b335`; later evidence-only documentation commits may advance the continuation branch without redeploying the immutable tagged application. Confirm exact local and remote hashes before declaring a cross-PC handoff synchronized.

## First continuation prompt

Use this exact prompt with Codex on the next PC:

> Continue EqualTrace from branch `codex/phase6-continuation` after tagged release commit `20ccacc499fcb8f7fed126f10af38e820c95b335`. First read AGENTS.md, docs/STATUS.md, docs/PRIORITIZATION.md, docs/WINNING_STANDARD.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, and every file in docs/hackathon-build/. Verify the current branch and commit, run `npm ci`, then resume the saved `$build-project` flow in autonomous mode at item 12 in docs/hackathon-build/checklist.md. Preserve `challenge-v1.0.0` as the exact deployed application identity, keep simulated/local/public-native evidence distinct, and do not submit to Devpost without explicit final confirmation. Update the checklist, STATUS.md, HANDOFF.md, and build-notes.md with exact evidence before stopping.

## GitHub authentication if needed

```powershell
gh auth login -h github.com -w
gh auth status
```

Never commit tokens, browser profiles, `.env` files, recordings containing private information, or Devpost credentials.
