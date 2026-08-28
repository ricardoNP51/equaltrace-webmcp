# Judge-first experience evidence — 2026-08-28

## Scope

This record covers checklist item 6 only: presentation of the already-proven baseline bypass. It does not claim approval, dynamic repair capability, repaired parity, public deployment, or release readiness.

Implementation commit: `d8f85295d21ff9e603995a168495c5c6dc1bfa24`.

## Opening comprehension

- Opening claim: `The agent got the right result. It skipped the protections.`
- Preview provenance: `Fixture preview · not current evidence`.
- Plain verdict: `Outcome passed. Protection parity failed.`
- First divergence: agent deletion commitment occurred before `disclosure.consequences`.
- The fictional account, scenario ID, version, seed, initial state, and native environment status are visible without opening the ledger.
- The current-session action is visible above the fold: reset and begin the baseline.

## Evidence linkage

- Visual and assistive disclosure references link to their exact deterministic trace events.
- Because the agent has no disclosure event, the observed comparison links to the agent's first actual event, `commit.delete`.
- Detailed visual, assistive, and agent traces remain collapsed until the reviewer opens `Open trace evidence`.
- Fixture preview, recorded human, simulated agent, and native agent provenance use explicit text labels rather than color alone.

## Automated verification

- Vitest: 36 tests across nine files passed.
- Playwright: eight browser journeys passed.
- Target viewports: 390×844, 1440×900, and 1920×1080.
- Each viewport asserted the opening verdict, preview provenance, first divergence, blocking guidance, and no horizontal page overflow.
- The same overflow check passed after expanding the trace ledger.

## Manual browser verification

- Client: Codex in-app browser 26.825.32147.
- Origin: `http://127.0.0.1:5174/`.
- Fresh reload displayed the verdict and honest preview label immediately.
- Native tool availability was reported by the actual environment; the preview still remained labelled fixture evidence.
- At 390×844 the measured viewport and document scroll widths were both 390 pixels.
- At the restored desktop viewport the measured horizontal overflow was zero.

## Limitations

- This is local presentation evidence, not public HTTPS release evidence.
- The responsive Playwright route uses the normal automated browser and does not satisfy native WebMCP acceptance.
- Native three-route baseline evidence remains separately recorded in `evidence/native/2026-08-28-three-route-baseline.md`.
- Human-only approval and repair capability lifetime are intentionally deferred to checklist items 7 and 8.
