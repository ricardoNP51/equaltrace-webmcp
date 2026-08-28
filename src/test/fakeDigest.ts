export class FakeDigestService {
  async sha256(value: string) {
    return `test-digest:${value}`;
  }
}
