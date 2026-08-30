# EqualTrace submission video

Programmatic, presenter-free launch video for the WebMCP Challenge. The compositions use the verified public-release screenshots, original motion graphics, local synthetic narration, and generated sound beds. They do not invent native evidence or present an automated browser registry as WebMCP validation.

The preferred candidate is `EqualTraceEvidenceCut`, a 1:54 evidence-documentary V2. `EqualTraceLaunch` preserves the original 2:30 dark launch-film cut for comparison.

## Direction

- 1920×1080, 30 fps, H.264/AAC, under three minutes.
- Working product in the first seconds; no logo-only intro.
- English synthetic narration; no participant face or recorded voice.
- V2 uses a distinct forensic/editorial language: evidence plates, registration marks, route traces, full captions, and large unobstructed product frames.
- Native lifecycle is explained from public-native screenshots and the frozen evidence record.

## Reproduce

1. Install the video dependencies with `npm install` in this directory.
2. Create a Python 3.10–3.13 virtual environment and install `kokoro-onnx` plus `soundfile`.
3. Download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the `thewh1teagle/kokoro-onnx` model-files release into `models/`.
4. Run `npm run narration:v2`.
5. Run `npm run soundbed:v2`.
6. Preview with `npm run studio` or render V2 with `npm run render:v2`.
7. Run `npm run verify:v2`.

The V2 output is `out/equaltrace-demo-v2.mp4`. The V1 commands remain `npm run soundbed`, `npm run render:final`, and `npm run verify`.

The final render is normalized to approximately -16 LUFS with a -1.5 dB true-peak ceiling and receives a fast-start MP4 index for reliable YouTube upload and browser playback.

Generated models, audio, and MP4 files stay local and are excluded from Git. The source, narration, timings, and screenshot inputs remain reviewable.
