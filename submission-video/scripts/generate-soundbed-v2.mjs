import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public", "generated", "soundbed-v2.wav");
mkdirSync(dirname(output), { recursive: true });

const filter = [
  "aevalsrc=0.010*sin(2*PI*55*t)+0.004*sin(2*PI*82.5*t)+0.002*sin(2*PI*440*t)*pow(sin(PI*t/8)\\,24):s=48000:d=114",
  "highpass=f=38",
  "lowpass=f=1800",
  "acompressor=threshold=-24dB:ratio=2:attack=15:release=180",
  "afade=t=in:st=0:d=1.5",
  "afade=t=out:st=109:d=5",
].join(",");

const result = spawnSync(
  "ffmpeg",
  ["-y", "-f", "lavfi", "-i", filter, "-c:a", "pcm_s16le", output],
  { stdio: "inherit" },
);

if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Created ${output}`);
