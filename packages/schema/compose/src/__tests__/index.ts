import { ComposerOutput, ComposerOptions, ComposerFilter } from "..";

import path from "path";
import { readdirSync, Dirent } from "fs";

import { TypeInfo } from "@web3api/schema-parse";
import {
  GetPathToComposeTestFiles,
  readFileIfExists,
  readNamedExportIfExists,
} from "@web3api/test-cases"

const root = GetPathToComposeTestFiles();

export interface TestCase {
  name: string;
  input: ComposerOptions;
  output: ComposerOutput;
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
        item.name,
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
  const queryInput = readFileIfExists("input/query.graphql", directory);
  const mutationInput = readFileIfExists("input/mutation.graphql", directory);

  // Fetch the output schemas
  const querySchema = readFileIfExists("output/query.graphql", directory);
  const ModuleTypeInfo = await readNamedExportIfExists<TypeInfo>("typeInfo", "output/query.ts", directory);
  const mutationSchema = readFileIfExists("output/mutation.graphql", directory);
  const mutationTypeInfo = await readNamedExportIfExists<TypeInfo>("typeInfo", "output/mutation.ts", directory);
  const schemaSchema = readFileIfExists("output/schema.graphql", directory);
  const schemaTypeInfo = await readNamedExportIfExists<TypeInfo>("typeInfo", "output/schema.ts", directory);

  const resolveExternal = (uri: string): Promise<string> => {
    return Promise.resolve(readFileIfExists(`imports-ext/${uri}/schema.graphql`, directory) || "");
  };

  const resolveLocal = (path: string): Promise<string> => {
    return Promise.resolve(readFileIfExists(path, directory, true) || "");
  };

  const input: ComposerOptions = {
    schemas: { },
    resolvers: {
      external: resolveExternal,
      local: resolveLocal,
    },
    output: ComposerFilter.All
  };

  if (queryInput) {
    input.schemas.query = {
      schema: queryInput,
      absolutePath: path.join(
        directory,
        "input/query.graphql"
      ),
    };
  }

  if (mutationInput) {
    input.schemas.mutation = {
      schema: mutationInput,
      absolutePath: path.join(
        directory,
        "input/mutation.graphql"
      ),
    };
  }

  const output: ComposerOutput = {
    combined: {}
  };

  if (querySchema && ModuleTypeInfo) {
    output.query = {
      schema: querySchema,
      typeInfo: ModuleTypeInfo
    };
  }

  if (mutationSchema && mutationTypeInfo) {
    output.mutation = {
      schema: mutationSchema,
      typeInfo: mutationTypeInfo
    };
  }

  if (schemaSchema && schemaTypeInfo) {
    output.combined = {
      schema: schemaSchema,
      typeInfo: schemaTypeInfo
    };
  }

  return {
    name,
    input,
    output,
  };
}
