export class FakeDigestService {
  async sha256(value: string) {
    let checksum = 0;
    for (const character of value) {
      checksum = (checksum * 31 + character.codePointAt(0)!) >>> 0;
    }
    return `test-digest-${value.length}-${checksum.toString(16).padStart(8, "0")}`;
  }
}
