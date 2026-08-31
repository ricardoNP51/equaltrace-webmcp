# EqualTrace submission video

Programmatic, presenter-free launch video for the WebMCP Challenge. The compositions use the verified public-release screenshots, original motion graphics, local synthetic narration, and generated sound beds. They do not invent native evidence or present an automated browser registry as WebMCP validation.

The preferred candidate is `EqualTraceLiveFinal`, the 1:20 Forensic Ledger public-release cut. It front-loads the concrete human loss, places the complete 6/6–6/6–2/6 contrast in the opening sequence, proves the native 4→5→4 capability lifetime, and closes on a deterministic receipt. Its six tracked product captures come from public commit `936146e8a0e18c1c3b1130f48528444cb88bf00f`. `EqualTraceB3`, `EqualTraceEvidenceCut`, and `EqualTraceLaunch` preserve the earlier comparison cuts.

## Direction

- 1920×1080, 30 fps, H.264/AAC, under three minutes.
- Working product in the first seconds; no logo-only intro.
- English synthetic narration; no participant face or recorded voice.
- The preferred cut uses EqualTrace's warm-paper Forensic Ledger language: editorial type, evidence plates, registration marks, route traces, full captions, and large unobstructed public-product frames.
- Native lifecycle is explained from public-native screenshots and the frozen evidence record.

## Reproduce

1. Install the video dependencies with `npm ci` in this directory.
2. Create a Python 3.10–3.13 virtual environment and install `kokoro-onnx` plus `soundfile`.
3. Download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the `thewh1teagle/kokoro-onnx` model-files release into `models/`.
4. Activate the virtual environment and run `npm run narration:live`.
5. Run `npm run soundbed:live`.
6. Preview with `npm run studio` or render the public cut with `npm run render:forensic:public`.
7. Run `npm run verify:forensic:public`.

The preferred output is `out/equaltrace-demo-forensic-ledger-public.mp4`. The local Forensic candidate, Final Live, B3, V2, and V1 commands remain available for comparison and reproducibility.

The final render is normalized to approximately -16 LUFS with a -1.5 dB true-peak ceiling and receives a fast-start MP4 index for reliable YouTube upload and browser playback.

Generated models, audio, and MP4 files stay local and are excluded from Git. The source, narration, timings, and screenshot inputs remain reviewable.
