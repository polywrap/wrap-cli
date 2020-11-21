import path from "path";
import { readdirSync, readFileSync, Dirent } from 'fs'

const root = path.join(__dirname, "./");

export type TestCases = {
  name: string;
  directory: string;
  inputSchema: string;
  outputLanguages: {
    name: string;
    directory: string;
  }[];
}[];


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
