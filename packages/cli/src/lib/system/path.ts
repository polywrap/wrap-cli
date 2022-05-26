import path from "path";
import fs from "fs";

export function displayPath(p: string): string {
  return "./" + path.relative(process.cwd(), p);
}

export function resolvePathIfExists(searchPaths: string[]): string | undefined {
  for (let i = 0; i < searchPaths.length; i++) {
    if (fs.existsSync(searchPaths[i])) {
      return path.resolve(searchPaths[i]);
    }
  }
  return undefined;
}
