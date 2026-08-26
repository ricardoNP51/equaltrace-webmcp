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

The repository is documentation-only at this checkpoint. Gate 1 creates the application scaffold and lockfile. After that, recreate dependencies from `package-lock.json`; never copy `node_modules`.

## First continuation prompt

Use this exact prompt with Codex on the next PC:

> Continue EqualTrace from the checked-out documentation repository. First read AGENTS.md, docs/STATUS.md, docs/WINNING_STANDARD.md, docs/ARCHITECTURE.md, and docs/ROADMAP.md. Verify the current branch and commit. Begin Gate 1 by scaffolding the smallest TypeScript application that proves native WebMCP registration before expanding the UI. Create and commit the lockfile and one-command quality gate. Do not claim native WebMCP validation from mocks or a polyfill. Update STATUS.md and HANDOFF.md with exact evidence and commit before stopping.

## GitHub authentication if needed

```powershell
gh auth login -h github.com -w
gh auth status
```

Never commit tokens, browser profiles, `.env` files, recordings containing private information, or Devpost credentials.
