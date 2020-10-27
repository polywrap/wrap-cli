import path from "path";
import { readdirSync, readFileSync, Dirent } from 'fs'
import { OutputDirectory, OutputEntry } from "../";

const root = path.join(__dirname, "./cases");

export type TestCases = Array<{
  name: string;
  directory: string;
  inputSchema: string;
  outputLanguages: {
    name: string;
    directory: string;
  }[];
}>;

export function fetchTestCases(): TestCases {
  const cases: TestCases = [];

  const importCase = (dirent: Dirent) => {
    // The case must be a folder
    if (!dirent.isDirectory()) {
      return;
    }

    // Fetch the input schema
    const inputSchema = readFileSync(
      path.join(root, dirent.name, 'input.graphql'),
      { encoding: "utf-8" }
    );

    // Fetch the output languages
    const outputDir = path.join(root, dirent.name, 'output');
    const outputLanguages = readdirSync(
      outputDir, { withFileTypes: true }
    ).filter(
      (item: Dirent) => item.isDirectory()
    ).map(
      (item: Dirent) => ({
        name: item.name,
        directory: path.join(outputDir, item.name)
      })
    );

    cases.push({
      name: dirent.name,
      directory: outputDir,
      inputSchema,
      outputLanguages
    });
  }

  readdirSync(root, { withFileTypes: true })
    .forEach(importCase);

  return cases;
}

export function fetchOutputDirectory(outputDir: string): OutputDirectory {

  const importDirectoryEntry = (dirent: Dirent): OutputEntry => {
    const direntPath = path.join(outputDir, dirent.name);

    if (dirent.isDirectory()) {

      const entries: OutputEntry[] =
        readdirSync(outputDir, { withFileTypes: true })
        .map(dirent => importDirectoryEntry(dirent));

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
    readdirSync(outputDir, { withFileTypes: true })
      .map(dirent => importDirectoryEntry(dirent));

  return { entries };
}
