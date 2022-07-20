import { ComposerOptions } from "..";

import path from "path";
import { readdirSync, Dirent } from "fs";

import { Abi, createAbi } from "@polywrap/schema-parse";
import {
  GetPathToComposeTestFiles,
  readFileIfExists,
  readNamedExportIfExists,
} from "@polywrap/test-cases"

const root = GetPathToComposeTestFiles();

export interface TestCase {
  name: string;
  input: ComposerOptions;
  abi: Abi;
}

type TestCases = {
  promise: Promise<TestCase | undefined>;
  name: string;
}[];

export function fetchTestCases(): TestCases {
  const testCases: TestCases = [];

  readdirSync(root, { withFileTypes: true }).forEach(
    (dirent: Dirent) => {
      buildTestCases(
        path.join(root, dirent.name),
        dirent.name,
        testCases
      );
    }
  );

  return testCases;
}

function buildTestCases(
  directory: string,
  name: string,
  testCases: TestCases
): void {
  const items = readdirSync(directory, { withFileTypes: true });

  if (
    items.some(x => x.name.startsWith("input")) &&
    items.some(x => x.name.startsWith("output"))
  ) {
    testCases.push({
      promise: importCase(directory, name),
      name: name
    });
  } else {
    for (const item of items) {
      buildTestCases(
        path.join(directory, item.name),
        name + " " + item.name,
        testCases
      );
    }
  }
}

async function importCase(
  directory: string,
  name: string,
): Promise<TestCase | undefined> {
  // Fetch the input schemas
  const moduleInput = readFileIfExists("input/module.graphql", directory);

  // Fetch the output abi
  const moduleAbi = await readNamedExportIfExists<Abi>("abi", "output/module.ts", directory);

  const resolveExternal = async (uri: string): Promise<Abi> => {
    let abi = createAbi()
    const generatedAbi = await readNamedExportIfExists<Abi>("abi", `imports-ext/${uri}/module.ts`, directory)
    if (generatedAbi) {
      abi = generatedAbi
    }
    return Promise.resolve(abi);
  };

  const resolveLocal = (path: string): Promise<string> => {
    return Promise.resolve(readFileIfExists(path, directory, true) || "");
  };

  const input: ComposerOptions = {
    schemaFile: {
      schema: moduleInput as string,
      absolutePath: path.join(
        directory,
        "input/module.graphql"
      ),
    },
    resolvers: {
      external: resolveExternal,
      local: resolveLocal,
    },
  };

  if (moduleInput) {
    input.schemaFile = {
      schema: moduleInput,
      absolutePath: path.join(
        directory,
        "input/module.graphql"
      ),
    };
  }

  return {
    name,
    input,
    abi: moduleAbi as Abi,
  };
}
