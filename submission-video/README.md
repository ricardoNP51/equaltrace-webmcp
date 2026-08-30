# EqualTrace submission video

Programmatic, presenter-free launch video for the WebMCP Challenge. The composition uses the verified public-release screenshots, original motion graphics, local synthetic narration, and a generated sound bed. It does not invent native evidence or present an automated browser registry as WebMCP validation.

## Direction

- 1920×1080, 30 fps, H.264/AAC, 2:30 maximum.
- Working product in the first seconds; no logo-only intro.
- English synthetic narration; no participant face or recorded voice.
- OpenAI/Anthropic-inspired restraint: large claim, real UI, short captions, controlled zoom, minimal chrome.
- Native lifecycle is explained from public-native screenshots and the frozen evidence record.

## Reproduce

1. Install the video dependencies with `npm install` in this directory.
2. Create a Python 3.10–3.13 virtual environment and install `kokoro-onnx` plus `soundfile`.
3. Download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the `thewh1teagle/kokoro-onnx` model-files release into `models/`.
4. Run `python scripts/generate_narration.py`.
5. Run `npm run soundbed`.
6. Preview with `npm run studio` or render with `npm run render:final`.
7. Run `npm run verify`.

The final render is normalized to approximately -16 LUFS with a -1.5 dB true-peak ceiling and receives a fast-start MP4 index for reliable YouTube upload and browser playback.

Generated models, audio, and MP4 files stay local and are excluded from Git. The source, narration, timings, and screenshot inputs remain reviewable.
