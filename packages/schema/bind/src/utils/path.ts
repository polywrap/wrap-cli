import Path from "path";

export function getRelativePath(from: string, to: string): string {
  if (!Path.isAbsolute(from)) {
    throw Error(`root path must be absolute. path: ${from}`);
  }

  if (!Path.isAbsolute(to)) {
    throw Error(`destination path must be absolute. path: ${to}`);
  }

  return normalizeWithLinuxPathSep(Path.relative(from, to));
}

export function normalizeWithLinuxPathSep(path: string): string {
  return Path.normalize(path).replace(/\\/g, "/");
}
