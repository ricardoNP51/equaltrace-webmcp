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

The repository is documentation-only at this checkpoint. Planning is complete through `docs/hackathon-build/checklist.md`; the saved Devpost workflow points to `$build-project`. Phase 1 creates the application scaffold and lockfile. After that, recreate dependencies from `package-lock.json`; never copy `node_modules`.

## First continuation prompt

Use this exact prompt with Codex on the next PC:

> Continue EqualTrace from the checked-out documentation repository. First read AGENTS.md, docs/STATUS.md, docs/PRIORITIZATION.md, docs/WINNING_STANDARD.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, and every file in docs/hackathon-build/. Verify the current branch and commit. Resume the saved `$build-project` flow in autonomous mode, beginning with the first unchecked item in docs/hackathon-build/checklist.md. Do not skip verification gates or claim native WebMCP validation from mocks or a polyfill. Update the checklist, STATUS.md, HANDOFF.md, and build-notes.md with exact evidence before stopping.

## GitHub authentication if needed

```powershell
gh auth login -h github.com -w
gh auth status
```

Never commit tokens, browser profiles, `.env` files, recordings containing private information, or Devpost credentials.
