import { mkdirSync, readdirSync, copyFileSync } from "fs";
import { join } from "path";

export const copyDir = (src: string, dest: string): void => {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    entry.isDirectory()
      ? copyDir(srcPath, destPath)
      : copyFileSync(srcPath, destPath);
  }
};
