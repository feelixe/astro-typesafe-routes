export type ResolvedRoute = {
  absolutePath: string;
  hasSearchSchema: boolean;
  path: string;
  params: string[] | null;
};

export type RequiredAstroConfig = {
  rootDir: string;
  buildOutput: "static" | "server";
};
