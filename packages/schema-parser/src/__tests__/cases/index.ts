import path from "path";
import { readdirSync, readFileSync, Dirent } from "fs";
import { TypeInfo } from "../../typeInfo";

const root = path.join(__dirname, "./");

export type TestCases = {
  name: string;
  input: string;
  output: TypeInfo
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

    // Fetch the output TypeInfo
    const outputTypeInfo = require(
      `./${dirent.name}/output.ts`
    ) as TypeInfo;

    cases.push({
      name: dirent.name,
      input: inputSchema,
      output: outputTypeInfo
    });
  }

  readdirSync(root, { withFileTypes: true })
    .forEach(importCase);

  return cases;
}
