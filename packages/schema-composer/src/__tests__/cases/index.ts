import {
  ComposerOutput,
  ComposerOptions
} from "../../";

import path from "path";
import { readdirSync, readFileSync, Dirent, existsSync } from "fs";

const root = path.join(__dirname, "./");

export type TestCases = {
  name: string;
  input: ComposerOptions;
  output: ComposerOutput;
}[];

export function fetchTestCases(): TestCases {
  const cases: TestCases = [];

  const importCase = (dirent: Dirent) => {
    // The case must be a folder
    if (!dirent.isDirectory()) {
      return;
    }

    const fetchIfExists = (subpath: string, absolute: boolean = false): string | undefined => {
      let filePath: string;

      if (absolute) {
        filePath = subpath;
      } else {
        filePath = path.join(root, dirent.name, subpath);
      }

      if (existsSync(filePath)) {
        return readFileSync(filePath, { encoding: "utf-8" });
      } else {
        return undefined;
      }
    }

    // Fetch the input schemas
    const queryInput = fetchIfExists("input/query.graphql");
    const mutationInput = fetchIfExists("input/mutation.graphql");

    // Fetch the output schemas
    const queryOutput = fetchIfExists("output/query.graphql");
    const mutationOutput = fetchIfExists("output/mutation.graphql");
    const schemaOutput = fetchIfExists("output/schema.graphql");

    const resolveExternal = (uri: string): string => {
      return fetchIfExists(`imports-ext/${uri}/schema.graphql`);
    }

    const resolveLocal = (path: string): string => {
      return fetchIfExists(path, true);
    }

    cases.push({
      name: dirent.name,
      input: {
        schemas: {
          query: queryInput ? {
            schema: queryInput,
            absolutePath: path.join(root, dirent.name, "input/query.graphql")
          } : undefined,
          mutation: mutationInput ? {
            schema: mutationInput,
            absolutePath: path.join(root, dirent.name, "input/mutation.graphql")
          } : undefined
        },
        resolvers: {
          external: resolveExternal,
          local: resolveLocal
        }
      },
      output: {
        query: queryOutput,
        mutation: mutationOutput,
        combined: schemaOutput
      }
    });
  }

  readdirSync(root, { withFileTypes: true })
    .forEach(importCase);

  return cases;
}
