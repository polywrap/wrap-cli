import path from "path";
import { GluegunFilesystem } from "gluegun";
import * as jetpack from "fs-jetpack";
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
    if (jetpack.exists(searchPaths[i])) {
      return path.resolve(searchPaths[i]);
    }
  }
  return undefined;
}
