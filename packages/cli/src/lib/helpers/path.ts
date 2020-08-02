import path from "path";

export function displayPath(p: string) {
  return path.relative(process.cwd(), p)
}
