import { OutputDirectory, OutputEntry } from "../";

import path from "path";
import {
  readdirSync,
  readFileSync,
  Dirent,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "fs";

// TODO: make this all async, making it run faster
export function readDirectory(dir: string): OutputDirectory {
  const importDirectoryEntry = (root: string, dirent: Dirent): OutputEntry => {
    const direntPath = path.join(root, dirent.name);

    if (dirent.isDirectory()) {
      const entries: OutputEntry[] = readdirSync(direntPath, {
        withFileTypes: true,
      }).map((dirent) => importDirectoryEntry(direntPath, dirent));

      return {
        type: "Directory",
        name: dirent.name,
        data: entries,
      };
    } else {
      return {
        type: "File",
        name: dirent.name,
        data: readFileSync(direntPath, { encoding: "utf-8" }),
      };
    }
  };

  const entries: OutputEntry[] = readdirSync(dir, {
    withFileTypes: true,
  }).map((dirent) => importDirectoryEntry(dir, dirent));

  return { entries };
}

export function writeDirectory(
  outputDir: string,
  dir: OutputDirectory
): string[] {
  const paths: string[] = [];

  const outputDirectoryEntry = (root: string, entry: OutputEntry) => {
    const entryPath = path.join(root, entry.name);
    paths.push(entryPath);

    if (entry.type === "File") {
      writeFileSync(entryPath, entry.data);
    } else {
      for (const subEntry of entry.data) {
        if (!existsSync(entryPath)) {
          mkdirSync(entryPath);
        }
        outputDirectoryEntry(entryPath, subEntry);
      }
    }
  };

  for (const entry of dir.entries) {
    outputDirectoryEntry(outputDir, entry);
  }

  return paths;
}
