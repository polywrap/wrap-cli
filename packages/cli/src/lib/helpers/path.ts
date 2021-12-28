import path from "path";
import { GluegunFilesystem } from "gluegun";

export function displayPath(p: string): string {
  return "./" + path.relative(process.cwd(), p);
}

export async function resolveManifestPath(
  filesystem: GluegunFilesystem,
  manifestPath: string,
  defaultManifest: string[]
): Promise<string> {
  if (manifestPath) {
    return filesystem.resolve(manifestPath);
  }
  for (let i = 0; i < defaultManifest.length - 1; i++) {
    if (await filesystem.existsAsync(defaultManifest[i])) {
      return filesystem.resolve(defaultManifest[i]);
    }
  }
  return filesystem.resolve(defaultManifest[defaultManifest.length - 1]);
}
