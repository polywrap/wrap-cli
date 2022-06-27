# Polywrap Schema Parse (@polywrap/schema-parse)

Parses and validates Polywrap schema.

## Usage

``` typescript
import { readFileSync } from "fs";
import { TypeInfo, parseSchema } from "@polywrap/schema-parse";

const schemaPath = "input/module.graphql"

const schema = readFileSync(schemaPath);

const typeInfo: TypeInfo = parseSchema(schema);

```
