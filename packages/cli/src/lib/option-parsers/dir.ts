import path from "path";

export function parseDirOption(
  dir: string | undefined | false,
  defaultDir: string
): string {
  return dir ? path.resolve(dir) : path.resolve(defaultDir);
}
