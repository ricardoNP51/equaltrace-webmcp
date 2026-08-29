function canonicalValue(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      throw new Error("Canonical values must be JSON serializable.");
    }
    return serialized;
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalValue).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalValue(record[key])}`)
    .join(",")}}`;
}

export function canonicalize(value: unknown): string {
  return canonicalValue(value);
}
