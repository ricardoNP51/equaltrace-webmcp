export class FakeClock {
  constructor(private currentTime = 0) {}

  now() {
    return this.currentTime;
  }

  advance(milliseconds: number) {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) {
      throw new Error("Clock advances must be finite and non-negative.");
    }

    this.currentTime += milliseconds;
  }
}
