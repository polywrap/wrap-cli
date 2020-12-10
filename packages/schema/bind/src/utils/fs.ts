import path from "path";
import { OutputDirectory, OutputEntry } from "../";
import { readdirSync, readFileSync, Dirent } from 'fs'

export function loadDirectory(dir: string): OutputDirectory {

  const importDirectoryEntry = (root: string, dirent: Dirent): OutputEntry => {
    const direntPath = path.join(root, dirent.name);

    if (dirent.isDirectory()) {

      const entries: OutputEntry[] =
        readdirSync(direntPath, { withFileTypes: true })
        .map(dirent => importDirectoryEntry(direntPath, dirent));

      return {
        type: "Directory",
        name: dirent.name,
        data: entries
      };
    } else {
      return {
        type: "File",
        name: dirent.name,
        data: readFileSync(direntPath, { encoding: "utf-8" })
      };
    }
  }

  const entries: OutputEntry[] =
    readdirSync(dir, { withFileTypes: true })
      .map(dirent => importDirectoryEntry(dir, dirent));

  return { entries };
}
