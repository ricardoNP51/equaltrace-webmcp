# EqualTrace Forensic Ledger design QA

Date: 2026-08-30

## Visual truth

- Selected direction: option 1, `Forensic Ledger`.
- Source image: `C:/Users/001/.codex/generated_images/01a04acf-9599-7992-ac99-e409c56324c7/exec-4c7d35e2-1480-41d8-8112-08263195c28d.png`.
- Preserved project copy: `artifacts/ui-forensic-ledger/selected-reference.png`.
- Reference pixels: 1487 x 1058.
- Implementation capture: `artifacts/ui-forensic-ledger/11-final-preview-1440x1024.jpg`.
- Implementation viewport: 1440 x 1024 CSS pixels; captured content area 1425 x 1013 pixels.
- Responsive capture: `artifacts/ui-forensic-ledger/10-mobile-390x844-preview.jpg`.
- Combined comparison: `artifacts/ui-forensic-ledger/12-comparison-final.jpg`.
- State compared: deterministic fixture preview before the current-session baseline is recorded.

## Comparison result

The implementation preserves the selected visual's defining system: warm paper surface, black editorial serif headline, compact sans-serif audit metadata, square controls, blue verified states, red missing states, a three-route protection ledger, and a restrained evidence-first hierarchy. The comparison was performed with the reference and implementation in one image at the same desktop viewport.

Intentional product-truth differences:

- The implementation reports the real fixture: agent feedback is present, so the baseline agent route is 2/6 rather than fabricating a missing feedback event.
- The scenario/version/seed strip and current-session disclaimer remain visible because they are required evidence boundaries.
- The primary action begins a real deterministic audit; `Inspect evidence` is the non-destructive secondary action.
- Full divergence details remain in the dedicated evidence region below the fold so the summary rail stays concise.

## Iteration history

| Pass  | Finding                                                                                                     | Severity | Resolution                                                                            |
| ----- | ----------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| 0     | Headline wrapped into four desktop lines and pushed the route ledger below the first viewport.              | P1       | Reduced display sizing and vertical spacing; densified the scenario strip and ledger. |
| 1     | Headline sentence join and partial ledger visibility weakened the reference match.                          | P2       | Added an explicit two-line headline and adjusted desktop density.                     |
| 2     | The secondary action and right-rail label did not match the selected hierarchy.                             | P2       | Added `Inspect evidence` and changed the rail to `First divergence`.                  |
| Final | Reference and implementation are visibly aligned; remaining differences are evidence-accuracy requirements. | Pass     | No P0, P1, or P2 mismatch remains.                                                    |

## Interaction and responsive QA

- Pointer route completed with pointer-origin evidence.
- Assistive route completed using Enter-only keyboard activation after focus.
- Broken WebMCP route recorded through the local supported client's native page tool.
- Baseline audit failed first at `disclosure.consequences`.
- Repair tool stayed absent before visible human approval, appeared only after approval, and removed itself immediately after one successful application.
- Fresh visual, assistive, and repaired WebMCP routes were recreated from the same scenario/version/seed.
- Repaired verification passed 6/6 checkpoints on all three routes and issued a deterministic receipt.
- Mobile viewport validated at 390 x 844 with no horizontal overflow (`scrollWidth` 375 equals `clientWidth` 375).
- Desktop viewport validated at 1440 x 1024 with no horizontal overflow (`scrollWidth` 1425 equals `clientWidth` 1425).
- Browser console warnings/errors: none.

Scope note: this is local supported-client evidence for the current branch. It does not replace a fresh public-release native validation after deployment.

final result: passed
