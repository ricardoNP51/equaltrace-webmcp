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

Phase 1 guided build is complete. Checklist items 1–12 cover the broken-to-repaired winner chain, release hardening, exact public deployment, five-run native release proof, and Devpost handoff. Release `challenge-v1.0.0` is deployed from commit `20ccacc499fcb8f7fed126f10af38e820c95b335` at `https://ricardonp51.github.io/equaltrace-webmcp/`. The submission draft is `devpost-submission.md`; the recording plan is `docs/DEMO_SCRIPT.md`; four release screenshots are under `evidence/submission/`; native receipt ID is `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`. The saved Devpost workflow now points to `$prepare-submission`. Recording/uploading the public video and actual submission remain human-confirmed external gates. Recreate dependencies with `npm ci`; never copy `node_modules`.

The active continuation branch is `codex/phase6-continuation`. `main` and this branch both contain release commit `20ccacc499fcb8f7fed126f10af38e820c95b335`; later evidence-only documentation commits may advance the continuation branch without redeploying the immutable tagged application. Confirm exact local and remote hashes before declaring a cross-PC handoff synchronized.

## First continuation prompt

Use this exact prompt with Codex on the next PC:

> Continue EqualTrace from branch `codex/phase6-continuation` after tagged release commit `20ccacc499fcb8f7fed126f10af38e820c95b335`. First read AGENTS.md, docs/STATUS.md, devpost-submission.md, docs/DEMO_SCRIPT.md, and docs/SUBMISSION_CHECKLIST.md. Verify the current branch and commit, run `npm ci`, then run `$prepare-submission` only when the project feels ready. Preserve the exact release identity, keep simulated/local/public-native evidence distinct, confirm the personal field answers and public video, and do not submit to Devpost without explicit final confirmation.

## GitHub authentication if needed

```powershell
gh auth login -h github.com -w
gh auth status
```

Never commit tokens, browser profiles, `.env` files, recordings containing private information, or Devpost credentials.
