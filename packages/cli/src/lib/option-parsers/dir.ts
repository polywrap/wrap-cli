import path from "path";

export function parseDirOption(
  dir: string | undefined,
  defaultDir: string
): string {
  return dir ? path.resolve(dir) : path.resolve(defaultDir);
}
