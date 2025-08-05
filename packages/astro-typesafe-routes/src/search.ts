import { deserialize } from "./search-serializer.js";
import type { StandardSchemaV1 } from "./standard-schema.js";

type AstroGlobal = {
  url: URL;
};

export class ValidationError extends Error {
  private _issues: readonly StandardSchemaV1.Issue[];

  constructor(
    issues: readonly StandardSchemaV1.Issue[],
    ...args: ConstructorParameters<typeof Error>
  ) {
    super(...args);
    this._issues = issues;
  }

  get issues() {
    return this._issues;
  }
}

export function getSearchSafe<T extends StandardSchemaV1>(astro: AstroGlobal, schema: T) {
  const deserializedSearch = deserialize(astro.url.searchParams);
  const validation = schema["~standard"].validate(
    deserializedSearch,
  ) as StandardSchemaV1.Result<unknown>;

  if (validation.issues) {
    return {
      success: false,
      error: {
        issues: validation.issues,
      },
      data: undefined,
    } as const;
  }
  return {
    success: true,
    error: undefined,
    data: validation.value,
  } as const;
}

export function getSearch<T extends StandardSchemaV1>(astro: AstroGlobal, schema: T) {
  const validation = getSearchSafe(astro, schema);
  if (!validation.success) {
    throw new ValidationError(validation.error.issues);
  }
  return validation.data as StandardSchemaV1.InferOutput<T>;
}

export async function getSearchSafeAsync<T extends StandardSchemaV1>(
  astro: AstroGlobal,
  schema: T,
) {
  const deserializedSearch = deserialize(astro.url.searchParams);
  const validation = await schema["~standard"].validate(deserializedSearch);

  if (validation.issues) {
    return {
      success: false,
      error: {
        issues: validation.issues,
      },
      data: undefined,
    } as const;
  }
  return {
    success: true,
    error: undefined,
    data: validation.value,
  } as const;
}

export async function getSearchAsync<T extends StandardSchemaV1>(astro: AstroGlobal, schema: T) {
  const validation = await getSearchSafeAsync(astro, schema);

  if (!validation.success) {
    throw new ValidationError(validation.error.issues);
  }
  return validation.data as StandardSchemaV1.InferOutput<T>;
}
