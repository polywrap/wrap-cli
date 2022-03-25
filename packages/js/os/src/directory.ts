import { writeFileSync } from "./file";
import { alphabeticalNamedSort } from "./sort";

import path from "path";
import { readdirSync, readFileSync, Dirent, mkdirSync, existsSync } from "fs";

export interface OutputDirectory {
  entries: OutputEntry[];
}

export type OutputEntry = FileEntry | DirectoryEntry | TemplateEntry;

export interface FileEntry {
  type: "File";
  name: string;
  data: string;
}

export interface DirectoryEntry {
  type: "Directory";
  name: string;
  data: OutputEntry[];
}

export interface TemplateEntry {
  type: "Template";
  name: string;
  data: string;
}

// TODO: make this all async, making it run faster
export function readDirectorySync(dir: string): OutputDirectory {
  const importDirectoryEntry = (root: string, dirent: Dirent): OutputEntry => {
    const direntPath = path.join(root, dirent.name);

    if (dirent.isDirectory()) {
      const entries: OutputEntry[] = readdirSync(direntPath, {
        withFileTypes: true,
      })
        .sort(alphabeticalNamedSort)
        .map((dirent) => importDirectoryEntry(direntPath, dirent));

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
  })
    .sort(alphabeticalNamedSort)
    .map((dirent) => importDirectoryEntry(dir, dirent));

  return { entries };
}

export function writeDirectorySync(
  outputDir: string,
  dir: OutputDirectory,
  renderTemplate?: (path: string) => string
): string[] {
  const paths: string[] = [];

  const outputDirectoryEntry = (root: string, entry: OutputEntry) => {
    const entryPath = path.join(root, entry.name);
    paths.push(entryPath);

    switch (entry.type) {
      case "File": {
        writeFileSync(entryPath, entry.data);
        break;
      }
      case "Directory": {
        for (const subEntry of entry.data) {
          if (!existsSync(entryPath)) {
            mkdirSync(entryPath, { recursive: true });
          }
          outputDirectoryEntry(entryPath, subEntry);
        }
        break;
      }
      case "Template": {
        if (!renderTemplate) {
          throw Error(
            `outputDirectoryEntry: No renderTemplate function provided. Found template ${entry.name}`
          );
        }

        writeFileSync(entryPath, renderTemplate(entry.data));
        break;
      }
      default: {
        throw Error(
          `outputDirectoryEntry: Unknown entry type. Entry: ${JSON.stringify(
            entry
          )}`
        );
      }
    }
  };

  for (const entry of dir.entries) {
    outputDirectoryEntry(outputDir, entry);
  }

  return paths;
}
