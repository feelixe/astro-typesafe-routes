export type DynamicRoute = {
  path: string;
  params: string[] | null;
  filePath: string;
  hasSearchSchema: boolean;
};
