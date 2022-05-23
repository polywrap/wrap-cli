import { BindModuleOptions } from "../";

import fs from "fs";
import path from "path";
import { TypeInfo } from "@web3api/schema-parse";
import {
  composeSchema,
  SchemaFile,
  ComposerFilter,
  SchemaKind,
} from "@web3api/schema-compose";
import { GetPathToBindTestFiles } from "@web3api/test-cases";
import { normalizeLineEndings } from "@web3api/os-js";

const root = GetPathToBindTestFiles();

export type TestCase = {
  name: string;
  directory: string;
  input: {
    modules: BindModuleOptions[];
    combined: BindModuleOptions;
    commonDirAbs: string;
  };
  outputLanguages: {
    language: string;
    directories: OutputTestDirectory;
  }[];
};

export type TestCases = {
  name: string;
  promise: Promise<TestCase | undefined>;
}[];

interface OutputTestDirectory {
  moduleWise?: {
    [name: string]: string
  };
  combined?: string;
}

export function fetchTestCases(): TestCases {
  const cases: TestCases = [];

  const fetchIfExists = (file: string): string | undefined => {
    if (fs.existsSync(file)) {
      return normalizeLineEndings(
        fs.readFileSync(file, { encoding: "utf-8" }),
        "\n"
      );
    } else {
      return undefined;
    }
  };

  const importCase = async (
    dirent: fs.Dirent
  ): Promise<TestCase | undefined> => {
    // The case must be a folder
    if (!dirent.isDirectory()) {
      return Promise.resolve(undefined);
    }

    // Fetch the input schemas
    const querySchemaFile = path.join(
      root,
      dirent.name,
      "input",
      "query.graphql"
    );
    const mutationSchemaFile = path.join(
      root,
      dirent.name,
      "input",
      "mutation.graphql"
    );

    const querySchema = fetchIfExists(querySchemaFile);
    const mutationSchema = fetchIfExists(mutationSchemaFile);

    // Fetch each language's expected output
    const outputDir = path.join(root, dirent.name, "output");
    const outputLanguages = fs
      .readdirSync(outputDir, { withFileTypes: true })
      .filter((item: fs.Dirent) => item.isDirectory())
      .map((item: fs.Dirent) => {
        const outputLanguageDir = path.join(outputDir, item.name);
        const outputDirectories: OutputTestDirectory = { };

        fs.readdirSync(outputLanguageDir, { withFileTypes: true })
          .filter((item: fs.Dirent) => item.isDirectory())
          .map((item: fs.Dirent) => {
            if (item.name === "combined") {
              outputDirectories.combined = path.join(
                outputLanguageDir, item.name
              );
            } else {
              if (!outputDirectories.moduleWise) {
                outputDirectories.moduleWise = { };
              }
              outputDirectories.moduleWise[item.name] = path.join(
                outputLanguageDir, item.name
              );
            }
          })

        return {
          language: item.name,
          directories: outputDirectories
        };
      });

    let schemas: Partial<Record<SchemaKind, SchemaFile>> = {};

    if (querySchema) {
      schemas["query"] = {
        schema: querySchema,
        absolutePath: querySchemaFile,
      };
    }

    if (mutationSchema) {
      schemas["mutation"] = {
        schema: mutationSchema,
        absolutePath: mutationSchemaFile,
      };
    }

    // Compose the input schemas into TypeInfo structures
    const composed = await composeSchema({
      schemas,
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
        },
      },
      output: ComposerFilter.All,
    });

    const modules: BindModuleOptions[] = [];

    if (querySchema) {
      modules.push({
        name: "query",
        typeInfo: composed.query?.typeInfo as TypeInfo,
        schema: composed.query?.schema as string,
        outputDirAbs: path.join(root, "query")
      });
    }

    if (mutationSchema) {
      modules.push({
        name: "mutation",
        typeInfo: composed.mutation?.typeInfo as TypeInfo,
        schema: composed.mutation?.schema as string,
        outputDirAbs: path.join(root, "mutation")
      });
    }

    const combined: BindModuleOptions = {
      name: "combined",
      typeInfo: composed.combined.typeInfo as TypeInfo,
      schema: composed.combined.schema as string,
      outputDirAbs: path.join(root, "combined")
    };

    // Add the newly formed test case
    return {
      name: dirent.name,
      directory: outputDir,
      input: {
        modules,
        combined,
        commonDirAbs: path.join(root, "common"),
      },
      outputLanguages,
    };
  };

  fs.readdirSync(root, { withFileTypes: true }).forEach((dirent: fs.Dirent) => {
    cases.push({
      name: dirent.name,
      promise: importCase(dirent),
    });
  });

  return cases;
}
