# Forensic Ledger public-release video audit

## Render identity

- Render: `submission-video/out/equaltrace-demo-forensic-ledger-public.mp4`
- Duration: 80.1 seconds.
- Format: 1920 × 1080, 30 fps, H.264 video, AAC stereo audio at 48 kHz.
- Size: 44,082,668 bytes.
- Audio: -16.2 LUFS integrated, -1.5 dBFS true peak.
- SHA-256: `f110a1dce505e4b080630669dab427e8c835514ac73a2615bb2fc3cad63639e7`.
- Automated verification: `npm run verify:forensic:public` passed.

## Public evidence basis

Every product capture in this cut comes from the GitHub Pages build at commit `936146e8a0e18c1c3b1130f48528444cb88bf00f`. The same supported-client session independently observed native tool discovery `4 → 5 → 4`, the baseline divergence at `disclosure.consequences`, fresh repaired parity, and receipt `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`. The bounded evidence is under `evidence/native/2026-08-31-forensic-ledger-public/`.

The in-frame cursor, zooms, labels, cuts, subtitles, and native-output layouts remain explicit editorial devices. They do not claim to be raw native browser chrome or independent WebMCP evidence.

## Visual inspection

Representative frames at approximately 0:03, 0:12, 0:25, 0:37, 0:49, 1:04, and 1:16 were inspected under `submission-video/out/forensic-public-audit/`.

- The opening immediately shows the real public product, the failed safety contract, and EqualTrace's own warm-paper editorial identity.
- The `6/6 · 6/6 · 2/6` comparison remains the clearest judge-facing proof and is readable without relying on narration.
- The first divergence, bounded repair, and five-tool approval state each occupy their own visual beat.
- The verified public state and final `3 routes / 6 protections / 1 receipt` close are coherent with the deployed interface.
- No inspected frame reintroduced the generic dark/glass AI-launch style of V1.

Verdict: **passed as the public-release final candidate**. Remaining gates are a complete human audiovisual watch, public YouTube upload, fresh-session playback of that URL, and explicit Devpost submission authorization.
