import path from "path";

export function parseDirOption(
  dir: string | undefined,
  defaultDir: string
): string {
  return dir ? path.resolve(dir) : path.resolve(defaultDir);
}

export function parseDirOptionIfExists(dir?: string): string | undefined {
  return dir ? path.resolve(dir) : undefined;
}
