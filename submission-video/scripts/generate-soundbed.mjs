import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public", "generated", "soundbed.wav");
mkdirSync(dirname(output), { recursive: true });

const filter = [
  "aevalsrc=0.018*sin(2*PI*110*t)+0.010*sin(2*PI*165*t)+0.006*sin(2*PI*220*t):s=48000:d=150",
  "lowpass=f=1400",
  "highpass=f=70",
  "afade=t=in:st=0:d=3",
  "afade=t=out:st=145:d=5",
].join(",");

const result = spawnSync(
  "ffmpeg",
  ["-y", "-f", "lavfi", "-i", filter, "-c:a", "pcm_s16le", output],
  { stdio: "inherit" },
);

if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Created ${output}`);
