export function file(path: unknown): boolean {
  if (typeof path !== "string") {
    return false;
  }

  // eslint-disable-next-line no-useless-escape
  const validPathMatch = path.match(/^((\.\/|..\/)[^\/ ]*)+\/?$/gm);

  let result = false;
  if (validPathMatch && validPathMatch[0]) {
    result = validPathMatch[0].length === path.length;
  }

  return result;
}
