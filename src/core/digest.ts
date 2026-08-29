export interface DigestService {
  sha256(value: string): Promise<string>;
}

export class BrowserDigestService implements DigestService {
  async sha256(value: string) {
    const bytes = new TextEncoder().encode(value);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  }
}

export interface Clock {
  now(): number;
}

export class SystemClock implements Clock {
  now() {
    return Date.now();
  }
}
