# Submission checklist

## Eligibility and repository

- [x] Work attributable to the challenge period is clear in Git history.
- [x] Open-source license exists at repository root.
- [x] Repository is public and GitHub detects the MIT license.
- [x] README setup works from a clean clone.
- [x] Tracked files contain no credential/secret file and submission captures use only original application UI.

## Working project

- [x] Public HTTPS URL loads without authentication.
- [x] Native WebMCP tools are discoverable in the recorded supported client.
- [x] Golden flow resets deterministically.
- [x] Application behavior matches the video exactly; editorial cursor and labels are disclosed.
- [x] Fresh-session smoke test passes.

## Demo video

- [ ] Public YouTube URL.
- [x] Less than three minutes.
- [x] Clear audio (-16.2 LUFS, -1.5 dBFS true peak).
- [x] Risk visible within 20 seconds.
- [x] Native tool use visible.
- [x] Human approval and tool lifetime visible.
- [x] Repair rerun and receipt visible.
- [x] No copyrighted music or unauthorized marks.

## Description

- [x] Why WebMCP is fundamental.
- [x] Better human experience.
- [x] What person and agent can do together that was previously difficult.
- [x] Brief implementation description.
- [x] Honest limitations and evidence links.

## Final proof

- [x] Tagged release clean clone passed `npm ci && npm run check`.
- [ ] Local handoff commit equals remote `main` after final push.
- [x] Release tag points to the deployed application commit.
- [ ] Live URL, repository, and video opened from a fresh session.
