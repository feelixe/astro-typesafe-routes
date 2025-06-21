import type { StandardSchemaV1 } from "./standard-schema.js";

export type CreateRouteParams = {
  id: string;
  searchSchema: StandardSchemaV1;
};

export function createRoute(args: CreateRouteParams) {
  return args;
}
