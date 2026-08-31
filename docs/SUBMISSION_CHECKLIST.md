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
- [x] Forensic Ledger is deployed from exact commit `936146e8a0e18c1c3b1130f48528444cb88bf00f`; the final video uses public captures from that revision and discloses editorial cursor, labels, and cuts.
- [x] Fresh-session smoke test passes.

## Demo video

- [x] Publicly accessible YouTube URL: https://youtu.be/IqdVB8k5CNA
- [x] Less than three minutes.
- [x] Clear audio (-16.2 LUFS, -1.5 dBFS true peak).
- [x] Risk visible within 20 seconds.
- [x] Native tool use visible.
- [x] Human approval and tool lifetime visible.
- [x] Repair rerun and receipt visible.
- [x] No copyrighted music or unauthorized marks.
- [x] Public Forensic Ledger candidate identifies the public build and exact short commit; its native evidence claim is backed by the supported-client session under `evidence/native/2026-08-31-forensic-ledger-public/`.

## Description

- [x] Why WebMCP is fundamental.
- [x] Better human experience.
- [x] What person and agent can do together that was previously difficult.
- [x] Brief implementation description.
- [x] Honest limitations and evidence links.

## Final proof

- [x] Tagged release clean clone passed `npm ci && npm run check`.
- [x] Public `main` equals deployed commit `936146e8a0e18c1c3b1130f48528444cb88bf00f`; the local continuation commit equals its remote branch.
- [x] Release tag points to the deployed application commit.
- [x] Live URL, repository, and video opened from fresh anonymous/supported-client sessions.
