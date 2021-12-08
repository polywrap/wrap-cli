import { BindModuleOptions } from "../";

import fs from "fs";
import path from "path";
import { TypeInfo } from "@web3api/schema-parse";
import { composeSchema, SchemaFile, ComposerFilter } from "@web3api/schema-compose";
import { GetPathToBindTestFiles } from "@web3api/test-cases";
import { normalizeLineEndings } from "@web3api/os-js";

const root = GetPathToBindTestFiles();

export type TestCase = {
  name: string;
  directory: string;
  input: {
    query?: BindModuleOptions;
    mutation?: BindModuleOptions;
    combined?: BindModuleOptions;
  },
  outputLanguages: {
    language: string;
    directories: {
      query?: string;
      mutation?: string;
      combined?: string;
    };
  }[];
};

export type TestCases = {
  name: string;
  promise: Promise<TestCase | undefined>;
}[];

export function fetchTestCases(): TestCases {
  const cases: TestCases = [];

  const fetchIfExists = (
    file: string
  ): string | undefined => {
    if (fs.existsSync(file)) {
      return normalizeLineEndings(
        fs.readFileSync(file, { encoding: "utf-8" }),
        "\n"
      );
    } else {
      return undefined;
    }
  };

  const importCase = async (dirent: fs.Dirent): Promise<TestCase | undefined> => {
    // The case must be a folder
    if (!dirent.isDirectory()) {
      return Promise.resolve(undefined);
    }

    // Fetch the input schemas
    const querySchemaFile = path.join(root, dirent.name, "input", "query.graphql");
    const mutationSchemaFile = path.join(root, dirent.name, "input", "mutation.graphql");

    const querySchema = fetchIfExists(querySchemaFile);
    const mutationSchema = fetchIfExists(mutationSchemaFile);

    // Fetch the output languages
    const outputDir = path.join(root, dirent.name, "output");
    const outputLanguages = fs.readdirSync(outputDir, { withFileTypes: true })
      .filter((item: fs.Dirent) => item.isDirectory())
      .map((item: fs.Dirent) => {
        const outputMutationDir = path.join(outputDir, item.name, "mutation");
        const outputMutation = fs.existsSync(outputMutationDir);
        const outputQueryDir = path.join(outputDir, item.name, "query");
        const outputQuery = fs.existsSync(outputQueryDir);

        return {
          language: item.name,
          directories: {
            query: outputMutation
              ? path.join(outputDir, item.name, "query")
              : undefined,
            mutation: outputQuery
              ? path.join(outputDir, item.name, "mutation")
              : undefined,
            combined: !outputMutation && !outputQuery
              ? path.join(outputDir, item.name)
              : undefined,
          }
        };
      });

    let schemas: Record<string, SchemaFile> = { };

    if (querySchema) {
      schemas["query"] = {
        schema: querySchema,
        absolutePath: querySchemaFile
      };
    }

    if (mutationSchema) {
      schemas["mutation"] = {
        schema: mutationSchema,
        absolutePath: mutationSchemaFile
      };
    }

    // Compose the input schemas into TypeInfo structures
    const composed = await composeSchema({
      schemas: {
        ...schemas,
      },
      resolvers: {
        external: (uri: string): Promise<string> => {
          return Promise.resolve(
            fetchIfExists(
              path.join(root, dirent.name, `imports-ext/${uri}/schema.graphql`)
            ) || ""
          );
        },
        local: (path: string): Promise<string> => {
          return Promise.resolve(fetchIfExists(path) || "");
        }
      },
      output: ComposerFilter.All
    })

    // Add the newly formed test case
    return {
      name: dirent.name,
      directory: outputDir,
      input: {
        query: querySchema ? {
          typeInfo: composed.query?.typeInfo as TypeInfo,
          schema: composed.query?.schema as string,
          outputDirAbs: path.join(root, "query")
        } : undefined,
        mutation: mutationSchema ? {
          typeInfo: composed.mutation?.typeInfo as TypeInfo,
          schema: composed.mutation?.schema as string,
          outputDirAbs: path.join(root, "mutation")
        }: undefined,
        combined: {
          typeInfo: composed.combined.typeInfo as TypeInfo,
          schema: composed.combined.schema as string,
          outputDirAbs: ""
        }
      },
      outputLanguages
    };
  };

  fs.readdirSync(root, { withFileTypes: true }).forEach((dirent: fs.Dirent) => {
    cases.push({
      name: dirent.name,
      promise: importCase(dirent)
    });
  });

  return cases;
}
