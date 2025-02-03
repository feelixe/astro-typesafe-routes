function parseOrUndefined(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export function serialize(search: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    searchParams.append(key, JSON.stringify(value));
  }
  return searchParams;
}

export function deserialize(search: string | URLSearchParams) {
  const params = new URLSearchParams(search);

  const result: Record<string, unknown> = {};
  for (const [key, value] of params) {
    const parsedValue = parseOrUndefined(value);
    if (parsedValue === undefined) {
      continue;
    }
    result[key] = parsedValue;
  }
  return result;
}
