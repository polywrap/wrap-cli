import path from "path";

const defaultBuildDir = "./build";

export function parseBuildOutputDirOption(
  outputDir: string | undefined,
  _: unknown
): string {
  return outputDir ? path.resolve(outputDir) : path.resolve(defaultBuildDir);
}

export function defaultBuildOutputDirOption(): string {
  return parseBuildOutputDirOption(undefined, undefined);
}
