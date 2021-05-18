export function file(file: unknown): boolean {
  if (typeof file !== "string") {
    return false;
  }

  // eslint-disable-next-line no-useless-escape
  const validPathMatch = file.match(/^((\.\/|..\/)[^\/ ]*)+\/?$/gm);

  let result = false;
  if (validPathMatch && validPathMatch[0]) {
    result = validPathMatch[0].length === file.length;
  }

  return result;
}
