import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const input = resolve(
  process.argv[2] ?? resolve("out", "equaltrace-demo-final-raw.mp4"),
);
const output = resolve(
  process.argv[3] ?? resolve("out", "equaltrace-demo-final.mp4"),
);
const result = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-i",
    input,
    "-map",
    "0:v:0",
    "-map",
    "0:a:0",
    "-c:v",
    "copy",
    "-af",
    "loudnorm=I=-16:LRA=7:TP=-1.5",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-ar",
    "48000",
    "-movflags",
    "+faststart",
    output,
  ],
  { stdio: "inherit" },
);

if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Created ${output}`);
