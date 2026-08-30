# Live final capture inputs

These files were captured from the public `challenge-v1.0.0` release in the Codex in-app browser on 2026-08-30.

They support the `EqualTraceLiveFinal` composition and keep page state separate from native agent-side evidence:

- PNG files are direct browser-viewport captures of the public page.
- `native-tools-before.txt` is the fresh four-tool discovery before valid approval.
- `native-tools-five.txt` is the fresh five-tool discovery after the valid visible approval.
- `native-tools-after-use.txt` is the fresh four-tool discovery after the single successful application.
- `native-apply-result.json` records `policy: repaired-agent` and `capability: removed_after_use`.
- `native-repaired-audit-result.json` records the passing receipt identity.

The first staged approval expired before a five-tool discovery. The repair was restaged with the same repair ID and digest; `17b-approval-boundary-renewed.png` and `native-tools-five.txt` belong to the second valid approval. The final video states this explicitly.

Cursor graphics, zooms, captions, cuts, and the formatted native-tool panel are editorial. The state transitions, tool lists, call results, repaired route evidence, and receipt are captured evidence rather than mock output.
