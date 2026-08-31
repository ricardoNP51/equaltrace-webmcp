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

Phase 1 guided build, the original tagged release, the Forensic Ledger redesign, and its public promotion are complete. Checklist items 1–20 cover the broken-to-repaired winner chain, release hardening, exact public deployment, native release proof, Devpost handoff, and video polish. GitHub Pages now serves exact commit `936146e8a0e18c1c3b1130f48528444cb88bf00f` at `https://ricardonp51.github.io/equaltrace-webmcp/`; quality run `33343667007` and Pages run `33343667031` succeeded. A fresh native public run proved `4 → 5 → 4`, fresh three-route parity, and receipt `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`; its record is under `evidence/native/2026-08-31-forensic-ledger-public/`. The preferred reproducible 1:20 video is `submission-video/out/equaltrace-demo-forensic-ledger-public.mp4`; its tracked public capture inputs are under `submission-video/public/forensic-final/`, its audit is `docs/VIDEO_FORENSIC_PUBLIC_AUDIT_2026-08-30.md`, and product visual QA is `design-qa.md`. The local Forensic candidate and earlier Final Live, B3, V2, and original cuts remain comparison artifacts. Human audiovisual review, public upload, and actual submission remain human-confirmed external gates. Recreate root and video dependencies with `npm ci` in their respective directories; never copy `node_modules`, `.venv`, generated speech, model weights, or video renders.

The active continuation branch is `codex/phase6-continuation`. Public `main` is intentionally pinned at deployed product commit `936146e8a0e18c1c3b1130f48528444cb88bf00f`; later evidence/video documentation commits may advance the continuation branch without changing the already validated public revision. Confirm the exact continuation-branch remote hash before declaring cross-PC handoff synchronized.

## First continuation prompt

Use this exact prompt with Codex on the next PC:

> Continue EqualTrace from branch `codex/phase6-continuation` after public Forensic Ledger commit `936146e8a0e18c1c3b1130f48528444cb88bf00f`. First read AGENTS.md, docs/STATUS.md, devpost-submission.md, docs/DEMO_SCRIPT.md, and docs/SUBMISSION_CHECKLIST.md. Verify the current branch and commit, run `npm ci`, then run `$prepare-submission` only when the project feels ready. Preserve the exact deployed revision and matching public video evidence, keep simulated/local/public-native evidence distinct, confirm the personal field answers and public video URL, and do not submit to Devpost without explicit final confirmation.

## GitHub authentication if needed

```powershell
gh auth login -h github.com -w
gh auth status
```

Never commit tokens, browser profiles, `.env` files, recordings containing private information, or Devpost credentials.
