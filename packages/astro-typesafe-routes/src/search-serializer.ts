function parseOrString(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function canStringifyBeSkipped(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  try {
    JSON.parse(value);
  } catch {
    return true;
  }
  return false;
}

export function serialize(search: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    const val = canStringifyBeSkipped(value) ? value : JSON.stringify(value);
    searchParams.append(key, val);
  }
  return searchParams;
}

export function deserialize(search: string | URLSearchParams) {
  const params = new URLSearchParams(search);

  const result: Record<string, unknown> = {};
  for (const [key, value] of params) {
    const parsedValue = parseOrString(value);
    result[key] = parsedValue;
  }
  return result;
}
