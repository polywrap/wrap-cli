import path from "path";

export function parseDirOptionNoDefault(
  dir: string | undefined | false
): string | false {
  return dir ? path.resolve(dir) : false;
}

export function parseDirOption(
  dir: string | undefined | false,
  defaultDir: string
): string {
  return dir ? path.resolve(dir) : path.resolve(defaultDir);
}
