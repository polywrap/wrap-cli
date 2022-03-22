import path from "path";
import { GluegunFilesystem } from "gluegun";
import fs from 'fs';
export function displayPath(p: string): string {
  return "./" + path.relative(process.cwd(), p);
}

export function resolvePathIfExists(
  filesystem: GluegunFilesystem,
  searchPaths: string[]
): string | undefined {
  for (let i = 0; i < searchPaths.length; i++) {
    if (filesystem.exists(searchPaths[i])) {
      return filesystem.resolve(searchPaths[i]);
    }
  }
  return undefined;
}


export function resolvePathIfExistsRefactor(
  searchPaths: string[]
): string | undefined {
  for (let i = 0; i < searchPaths.length; i++) {
      if (fs.existsSync(searchPaths[i])) {
          return searchPaths[i];
      }
  }
  return undefined;
}
