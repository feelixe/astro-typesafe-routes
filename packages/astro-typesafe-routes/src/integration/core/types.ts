export type ResolvedRoute = {
  absolutePath: string;
  hasSearchSchema: boolean;
  path: string;
  params: string[] | null;
};
