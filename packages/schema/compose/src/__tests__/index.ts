import { ComposerOutput, ComposerOptions, ComposerFilter } from "..";

import path from "path";
import { readdirSync, readFileSync, Dirent, existsSync } from "fs";

import { TypeInfo } from "@web3api/schema-parse";
import { GetPathToComposeTestFiles } from "@web3api/test-cases"
import { normalizeLineEndings } from "@web3api/os-js";

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

const importCase = async (basePath: string, dirent: Dirent): Promise<TestCase | undefined> => {
  // The case must be a folder
  if (!dirent.isDirectory()) {
    return undefined;
  }

  const getFilePath = (
    subpath: string,
    absolute = false
  ): string => {
    if (absolute) {
      return subpath
    } else {
      return path.join(basePath, dirent.name, subpath);
    }
  }

  const fetchIfExists = (
    subpath: string,
    absolute = false
  ): string | undefined => {
    const filePath = getFilePath(subpath, absolute);

    if (existsSync(filePath)) {
      return normalizeLineEndings(
        readFileSync(filePath, { encoding: "utf-8" }),
        "\n"
      );
    } else {
      return undefined;
    }
  };

  const importIfExists = async (
    subpath: string,
    absolute = false
  ): Promise<TypeInfo | undefined> => {
    const filePath = getFilePath(subpath, absolute);

    if (existsSync(filePath)) {
      const module = await import(filePath);

      if (!module.typeInfo) {
        throw Error(
          `Required named export "typeInfo" is missing in ${filePath}`
        );
      }

      return module.typeInfo as TypeInfo;
    } else {
      return undefined;
    }
  }

  // Fetch the input schemas
  const queryInput = fetchIfExists("input/query.graphql");
  const mutationInput = fetchIfExists("input/mutation.graphql");

  // Fetch the output schemas
  const querySchema = fetchIfExists("output/query.graphql");
  const queryTypeInfo = await importIfExists("output/query.ts");
  const mutationSchema = fetchIfExists("output/mutation.graphql");
  const mutationTypeInfo = await importIfExists("output/mutation.ts");
  const schemaSchema = fetchIfExists("output/schema.graphql");
  const schemaTypeInfo = await importIfExists("output/schema.ts");

  const resolveExternal = (uri: string): Promise<string> => {
    return Promise.resolve(fetchIfExists(`imports-ext/${uri}/schema.graphql`) || "");
  };

  const resolveLocal = (path: string): Promise<string> => {
    return Promise.resolve(fetchIfExists(path, true) || "");
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
        basePath,
        dirent.name,
        "input/query.graphql"
      ),
    };
  }

  if (mutationInput) {
    input.schemas.mutation = {
      schema: mutationInput,
      absolutePath: path.join(
        basePath,
        dirent.name,
        "input/mutation.graphql"
      ),
    };
  }

  const output: ComposerOutput = {
    combined: {}
  };

  if (querySchema && queryTypeInfo) {
    output.query = {
      schema: querySchema,
      typeInfo: queryTypeInfo
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
    name: dirent.name,
    input,
    output,
  };
};

export function fetchTestCases(): TestCases {
  const testCases: TestCases = [];

  readdirSync(root, { withFileTypes: true }).forEach(
    (dirent: Dirent) => {
      buildTestCases(root, root, dirent, testCases)
    }
  );

  return testCases;
}

export const buildTestCases = (rootPath: string, basePath: string, dirent: Dirent, testCases: TestCases) => {
  const fullPath = path.join(basePath, dirent.name);

  const items = readdirSync(fullPath, { withFileTypes: true });

  if(items.some(x => x.name === "input") && 
    items.some(x => x.name === "output")
  ) {
    testCases.push({
      promise: importCase(basePath, dirent),
      name: path.relative(rootPath, fullPath), 
    });
  } else {
    for(const item of items) {
      buildTestCases(rootPath, fullPath, item, testCases);
    }
  }
}