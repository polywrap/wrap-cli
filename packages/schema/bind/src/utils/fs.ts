import { OutputDirectory, OutputEntry } from "../";
import { alphabeticalNamedSort } from "./sort";

import { writeFileSync } from "@web3api/os-js";
import path from "path";
import { readdirSync, readFileSync, Dirent, mkdirSync, existsSync } from "fs";

// TODO: make this all async, making it run faster
export function readDirectory(dir: string): OutputDirectory {
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

export function writeDirectory(
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
            mkdirSync(entryPath);
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
