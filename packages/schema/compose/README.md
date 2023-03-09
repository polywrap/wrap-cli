# Polywrap Schema Compose (@polywrap/schema-compose)

Composes GraphQL schema source and typings for passing to schema-bind.

## Usage

``` typescript
import path from "path";
import { readFileSync } from "fs";
import { ComposerOptions, ComposeFilter, composeSchema } from "@polywrap/schema-compose";
import { TypeInfo } from "@polywrap/schema-parse";

const schemaPath = "input/module.graphql"

const schema = readFileSync(schemaPath);

const resolveExternal = (uri: string): Promise<string> => {
  return Promise.resolve(readFileSync(`imports-ext/${uri}/schema.graphql`) || "");
};

const resolveLocal = (path: string): Promise<string> => {
  return Promise.resolve(readFileSync(path) || "");
};

const input: ComposerOptions = {
  schemas: [{
    schema,
    absolutePath,
  }],
  abiResolver: (
    importFrom: string,
    schemaFile: SchemaFile
  ) => Promise<Abi | SchemaFile> => {
    ...
  },
  output: ComposerFilter.All
};

const output: ComposerOutput = composeSchema(input);

const { schema: string, typeInfo: TypeInfo } = output;

```
