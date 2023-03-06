import { ComposerOptions, SchemaFile } from "..";
import {
  readFileIfExists,
  getFilePath,
  readNamedExportIfExists
} from "./utils";

import path from "path";
import { readdirSync, Dirent } from "fs";

import { Uri } from "@polywrap/core-js";
import { Abi, createAbi } from "@polywrap/schema-parse";
import { GetPathToComposeTestFiles } from "@polywrap/test-cases"

const root = GetPathToComposeTestFiles();

export interface TestCase {
  name: string;
  input: ComposerOptions;
  abi: Abi;
  schema: string | undefined;
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
  const moduleInput = readFileIfExists(path.join(directory, "input/module.graphql"));
  const moduleDir = path.join(directory, "input");

  // Fetch the output abi
  const moduleAbi = await readNamedExportIfExists<Abi>("abi", path.join(directory, "output/module.ts"));

  // Fetch the output schema
  const moduleSchema = readFileIfExists(path.join(directory, "output/module.graphql"));

  const resolveUri = async (uri: string): Promise<Abi> => {
    let abi = createAbi()
    const generatedAbi = await readNamedExportIfExists<Abi>(
      "abi",
      path.join(directory, `imports-ext/${uri}/module.ts`)
    );
    if (generatedAbi) {
      abi = generatedAbi
    }
    return Promise.resolve(abi);
  };

  const resolvePath = (importFrom: string, sourceDir: string): SchemaFile => {
    const absolutePath = getFilePath(importFrom, sourceDir);
    const schema = readFileIfExists(absolutePath);
    if (!schema) {
      throw Error(`Did not find schema in directory "${sourceDir}" from import "${importFrom}"`);
    }
    return {
      schema,
      absolutePath
    };
  };

  if (!moduleInput) {
    throw new Error("Expected input schema.graphql file to Exist")
  }

  const schemaPath = path.join(
    moduleDir,
    "module.graphql"
  );

  const input: ComposerOptions = {
    schema: {
      schema: moduleInput,
      absolutePath: schemaPath,
    },
    abiResolver: async (importFrom: string, schemaFile: SchemaFile): Promise<Abi | SchemaFile> => {
      if (Uri.isValidUri(importFrom) || importFrom.endsWith(".eth")) {
        return await resolveUri(importFrom);
      } else {
        return Promise.resolve(resolvePath(
          importFrom,
          path.dirname(schemaFile.absolutePath)
        ));
      }
    },
  };

  if (moduleInput) {
    input.schema = {
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
    schema: moduleSchema
  };
}
