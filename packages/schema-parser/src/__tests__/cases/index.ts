import { TypeInfo } from "../../typeInfo";

import { create } from "ts-node";
import path from "path";
import { readdirSync, readFileSync, Dirent } from "fs";

const root = path.join(__dirname, "./");

const outputs = {
  sanity: require('./sanity/output').output
}

export type TestCases = {
  name: string;
  input: string;
  output: TypeInfo
}[];

export function fetchTestCases(): TestCases {
  const cases: TestCases = [];
  const compiler = create();

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
    const outputTypeInfo = outputs[dirent.name];

    if (!outputTypeInfo) {
      throw Error(`Test case output TypeInfo is missing for case "${dirent.name}"`);
    }

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
