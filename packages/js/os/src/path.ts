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

export function getCommonPath(a: string, b: string): string {
  // Walk the two path strings from left->right
  // and return all common parent directories
  a = normalizeWithLinuxPathSep(a);
  b = normalizeWithLinuxPathSep(b);

  let common = "";
  let idx = a.indexOf("/");

  if (idx === -1) {
    idx = a.length;
  }

  while (idx !== -1) {
    const segA = a.substr(0, idx + 1);
    const segB = b.substr(0, idx + 1);
    if (segA === segB) {
      common = segA;
      idx = a.indexOf("/", idx + 1);
    } else {
      idx = -1;
    }
  }

  return common;
}

export function normalizeWithLinuxPathSep(path: string): string {
  return Path.normalize(path).replace(/\\/g, "/");
}
